import {
  Injectable, Logger, NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus, BillingDetails, InvoiceLineItem } from './entities/invoice.entity';
import { Order } from './entities/order.entity';
import { User } from '../../auth/src/entities/user.entity';
import { UserProfile } from '../../auth/src/entities/user-profile.entity';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
  ) {}

  // ── Generate invoice after successful payment ─────────────────

  async generateForOrder(order: Order, userId: string): Promise<Invoice> {
    // Idempotency: don't duplicate
    const existing = await this.invoiceRepo.findOne({ where: { orderId: order.id } });
    if (existing) return existing;

    const user    = await this.userRepo.findOne({ where: { id: userId } });
    const profile = await this.profileRepo.findOne({ where: { userId } });

    const billingDetails: BillingDetails = {
      fullName:    user?.fullName ?? profile?.fullName ?? 'Customer',
      email:       user?.email ?? '',
      phone:       profile?.phone,
      companyName: profile?.companyName,
      address: {
        line1:   (order.shippingAddress as any)?.line1 ?? '',
        line2:   (order.shippingAddress as any)?.line2,
        city:    (order.shippingAddress as any)?.city ?? '',
        state:   (order.shippingAddress as any)?.state,
        country: (order.shippingAddress as any)?.country ?? '',
        pincode: (order.shippingAddress as any)?.postcode ?? (order.shippingAddress as any)?.pincode ?? '',
      },
    };

    const lineItems: InvoiceLineItem[] = (order.items ?? []).map((item) => ({
      productId: item.productId,
      name:      `Product (${item.productId.slice(0, 8)})`,
      quantity:  item.quantity,
      unitPrice: Number(item.unitPrice),
      total:     Number(item.unitPrice) * item.quantity,
      finish:    item.finish,
    }));

    const subtotal = lineItems.reduce((s, i) => s + i.total, 0);
    const tax      = 0; // GST can be applied here based on business rules
    const total    = subtotal + tax;

    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = this.invoiceRepo.create({
      orderId:        order.id,
      userId,
      invoiceNumber,
      billingDetails,
      items:          lineItems,
      subtotal,
      tax,
      total,
      currency:       order.currency ?? 'INR',
      status:         InvoiceStatus.Paid,
    });

    return this.invoiceRepo.save(invoice);
  }

  // ── PDF generation using pdfkit ───────────────────────────────
  // Install: npm install pdfkit @types/pdfkit  (in backend/apps/gateway)

  async generatePdf(invoiceId: string, userId: string): Promise<Buffer> {
    const invoice = await this.invoiceRepo.findOne({ where: { id: invoiceId } });
    if (!invoice) throw new NotFoundException(`Invoice ${invoiceId} not found`);

    // Only allow the invoice owner or admin to download
    if (invoice.userId !== userId) throw new NotFoundException('Not found');

    return this.buildPdfBuffer(invoice);
  }

  async generatePdfAdmin(invoiceId: string): Promise<{ buffer: Buffer; invoice: Invoice }> {
    const invoice = await this.invoiceRepo.findOne({ where: { id: invoiceId } });
    if (!invoice) throw new NotFoundException(`Invoice ${invoiceId} not found`);
    const buffer = await this.buildPdfBuffer(invoice);
    return { buffer, invoice };
  }

  private async buildPdfBuffer(invoice: Invoice): Promise<Buffer> {
    // Dynamic import so the app doesn't fail if pdfkit is not yet installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — pdfkit types require the package to be installed: npm install pdfkit @types/pdfkit
    const PDFDocument = require('pdfkit');

    return new Promise((resolve, reject) => {
      const doc    = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data',  (chunk: Buffer) => chunks.push(chunk));
      doc.on('end',   () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const gold    = '#c9a96e';
      const dark    = '#1a1a1a';
      const muted   = '#888888';
      const light   = '#f5f5f3';
      const pageW   = doc.page.width;
      const margin  = 50;
      const contentW = pageW - margin * 2;

      // ── Header ────────────────────────────────────────────────
      doc.fillColor(dark)
         .font('Helvetica-Bold')
         .fontSize(24)
         .text('MODULAS', margin, margin);

      doc.fillColor(gold)
         .fontSize(9)
         .font('Helvetica')
         .text('Luxury Furniture · modulas.in', margin, margin + 28);

      // "INVOICE" label — top right
      doc.fillColor(dark)
         .font('Helvetica-Bold')
         .fontSize(28)
         .text('INVOICE', pageW - margin - 120, margin, { width: 120, align: 'right' });

      doc.fillColor(muted)
         .font('Helvetica')
         .fontSize(9)
         .text(invoice.invoiceNumber, pageW - margin - 120, margin + 34, { width: 120, align: 'right' });

      // Divider
      doc.moveTo(margin, 110)
         .lineTo(pageW - margin, 110)
         .strokeColor(gold)
         .lineWidth(0.75)
         .stroke();

      // ── Bill To ───────────────────────────────────────────────
      const bil = invoice.billingDetails;
      doc.fillColor(muted)
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('BILL TO', margin, 125);

      doc.fillColor(dark)
         .font('Helvetica-Bold')
         .fontSize(11)
         .text(bil.fullName, margin, 140);

      if (bil.companyName) {
        doc.font('Helvetica').fontSize(9).fillColor(muted).text(bil.companyName, margin);
      }

      doc.font('Helvetica').fontSize(9).fillColor(dark)
         .text(bil.address.line1)
         .text([bil.address.line2, `${bil.address.city}${bil.address.state ? `, ${bil.address.state}` : ''} ${bil.address.pincode}`, bil.address.country].filter(Boolean).join('\n'))
         .text(bil.email)
         .text(bil.phone ?? '');

      // Invoice meta — right column
      const metaX = pageW - margin - 200;
      let metaY = 125;
      const addMeta = (label: string, value: string) => {
        doc.fillColor(muted).font('Helvetica').fontSize(8).text(label, metaX, metaY, { width: 90 });
        doc.fillColor(dark).font('Helvetica-Bold').fontSize(9).text(value, metaX + 95, metaY, { width: 105, align: 'right' });
        metaY += 18;
      };

      addMeta('Invoice Date', new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
      addMeta('Invoice No.', invoice.invoiceNumber);
      addMeta('Order Ref.', invoice.orderId.slice(0, 8).toUpperCase());
      addMeta('Status', invoice.status.toUpperCase());

      // ── Items table ───────────────────────────────────────────
      const tableY = 270;

      // Header row
      doc.rect(margin, tableY, contentW, 24)
         .fill(dark);

      const colX = { desc: margin + 8, qty: margin + 290, unit: margin + 360, total: margin + 420 };

      doc.fillColor('#ffffff')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('DESCRIPTION', colX.desc, tableY + 8)
         .text('QTY', colX.qty, tableY + 8)
         .text('UNIT PRICE', colX.unit, tableY + 8)
         .text('TOTAL', colX.total, tableY + 8);

      let rowY = tableY + 24;

      invoice.items.forEach((item, i) => {
        const bg = i % 2 === 0 ? '#ffffff' : light;
        doc.rect(margin, rowY, contentW, 28).fill(bg);

        doc.fillColor(dark)
           .font('Helvetica-Bold')
           .fontSize(9)
           .text(item.name, colX.desc, rowY + 5, { width: 240 });

        if (item.finish) {
          doc.fillColor(muted).font('Helvetica').fontSize(7.5)
             .text(item.finish, colX.desc, rowY + 16, { width: 240 });
        }

        const currency = invoice.currency === 'INR' ? '₹' : invoice.currency === 'GBP' ? '£' : '$';

        doc.fillColor(dark).font('Helvetica').fontSize(9)
           .text(String(item.quantity), colX.qty, rowY + 9)
           .text(`${currency}${Number(item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, colX.unit, rowY + 9)
           .text(`${currency}${Number(item.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, colX.total, rowY + 9);

        rowY += 28;
      });

      // Divider after items
      doc.moveTo(margin, rowY + 8)
         .lineTo(pageW - margin, rowY + 8)
         .strokeColor('#dddddd')
         .lineWidth(0.5)
         .stroke();

      rowY += 20;

      // ── Totals ────────────────────────────────────────────────
      const currency = invoice.currency === 'INR' ? '₹' : invoice.currency === 'GBP' ? '£' : '$';
      const totalX   = pageW - margin - 200;

      const addTotal = (label: string, value: string, bold = false, color = dark) => {
        doc.fillColor(muted).font('Helvetica').fontSize(9).text(label, totalX, rowY, { width: 110 });
        doc.fillColor(color).font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(bold ? 11 : 9)
           .text(value, totalX + 115, rowY, { width: 85, align: 'right' });
        rowY += bold ? 20 : 16;
      };

      addTotal('Subtotal', `${currency}${Number(invoice.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
      addTotal('Tax / GST', `${currency}${Number(invoice.tax).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);

      doc.moveTo(totalX, rowY)
         .lineTo(pageW - margin, rowY)
         .strokeColor(gold)
         .lineWidth(0.75)
         .stroke();

      rowY += 8;
      addTotal('TOTAL', `${currency}${Number(invoice.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, true, gold);

      // ── Footer ────────────────────────────────────────────────
      const footerY = doc.page.height - 80;

      doc.moveTo(margin, footerY)
         .lineTo(pageW - margin, footerY)
         .strokeColor('#eeeeee')
         .lineWidth(0.5)
         .stroke();

      doc.fillColor(muted)
         .font('Helvetica')
         .fontSize(7.5)
         .text('Thank you for choosing Modulas. For queries, write to hello@modulas.in', margin, footerY + 10, {
           width: contentW, align: 'center',
         });

      doc.text('Modulas · Gurgaon, Haryana, India · GSTIN: 06AAAAA0000A1Z5', margin, footerY + 22, {
        width: contentW, align: 'center',
      });

      doc.end();
    });
  }

  // ── Invoice number generation ─────────────────────────────────

  private async generateInvoiceNumber(): Promise<string> {
    const latest = await this.invoiceRepo.findOne({
      where: {},
      order: { createdAt: 'DESC' },
      select: ['invoiceNumber'],
    });

    const now    = new Date();
    const ym     = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

    if (!latest?.invoiceNumber) {
      return `INV-${ym}-000001`;
    }

    const parts  = latest.invoiceNumber.split('-');
    const lastN  = parseInt(parts[2] ?? '0', 10);
    const nextN  = String(lastN + 1).padStart(6, '0');
    return `INV-${ym}-${nextN}`;
  }

  // ── Queries ───────────────────────────────────────────────────

  async findByUser(userId: string): Promise<Invoice[]> {
    return this.invoiceRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByOrderId(orderId: string): Promise<Invoice | null> {
    return this.invoiceRepo.findOne({ where: { orderId } });
  }

  async adminList(page = 1, limit = 50, search?: string) {
    const qb = this.invoiceRepo.createQueryBuilder('i').orderBy('i.createdAt', 'DESC');

    if (search) {
      qb.where('i.invoice_number ILIKE :s OR i.user_id::text ILIKE :s', {
        s: `%${search}%`,
      });
    }

    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async exportCsv(): Promise<string> {
    const invoices = await this.invoiceRepo.find({ order: { createdAt: 'DESC' } });
    const header = 'invoiceNumber,orderId,userId,customerName,email,subtotal,tax,total,currency,status,createdAt\n';
    const rows = invoices.map((inv) => {
      const bil = inv.billingDetails ?? {};
      return [
        inv.invoiceNumber,
        inv.orderId,
        inv.userId,
        `"${(bil.fullName ?? '').replace(/"/g, '""')}"`,
        bil.email ?? '',
        inv.subtotal,
        inv.tax,
        inv.total,
        inv.currency,
        inv.status,
        new Date(inv.createdAt).toISOString().slice(0, 10),
      ].join(',');
    });
    return header + rows.join('\n');
  }
}
