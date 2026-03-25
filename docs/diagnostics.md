# Project Diagnostics

Generated: 2026-03-14

This document contains the TypeScript backend diagnostics and frontend runtime errors captured during the previous checks. No source files were modified.

---

## Backend TypeScript Diagnostics (captured from `npx tsc -p backend/tsconfig.json --noEmit`)

```
backend/apps/affiliate/src/modules/commissions/commissions.service.ts:6:28 - error TS2307: Cannot find module './entities/commission.entit
y' or its corresponding type declarations.
6 import { Commission } from "./entities/commission.entity";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/affiliate/src/modules/commissions/commissions.service.ts:7:34 - error TS2307: Cannot find module './entities/commission-ledge
r.entity' or its corresponding type declarations.
7 import { CommissionLedger } from "./entities/commission-ledger.entity";
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/affiliate/src/modules/commissions/commissions.service.ts:8:25 - error TS2307: Cannot find module '../creators/entities/creato
r.entity' or its corresponding type declarations.
8 import { Creator } from "../creators/entities/creator.entity";
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/affiliate/src/modules/commissions/commissions.service.ts:9:37 - error TS2307: Cannot find module '@modulas/messaging/events' 
or its corresponding type declarations.
9 import { OrderCompletedEvent } from "@modulas/messaging/events";
                                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/affiliate/src/modules/commissions/commissions.service.ts:55:23 - error TS18046: 'commission' is of type 'unknown'.

55         commissionId: commission.id,
                         ~~~~~~~~~~

backend/apps/catalog/src/modules/products/products.controller.ts:42:15 - error TS2339: Property 'Admin' does not exist on type 'typeof Rol
e'.
42   @Roles(Role.Admin, Role.Editor)
                 ~~~~~

backend/apps/catalog/src/modules/products/products.controller.ts:50:15 - error TS2339: Property 'Admin' does not exist on type 'typeof Rol
e'.
50   @Roles(Role.Admin, Role.Editor)
                 ~~~~~

backend/apps/catalog/src/modules/products/products.controller.ts:61:15 - error TS2339: Property 'Admin' does not exist on type 'typeof Rol
e'.
61   @Roles(Role.Admin)
                 ~~~~~

backend/apps/catalog/src/modules/products/products.service.ts:61:7 - error TS2769: No overload matches this call.
  Overload 1 of 3, '(this: That, params?: import("c:/Users/Admin/Modulas E-commerce/node_modules/@elastic/elasticsearch/lib/api/types").Se
archRequest | import("c:/Users/Admin/Modulas E-commerce/node_modules/@elastic/elasticsearch/lib/api/typesWithBodyKey").SearchRequest | undefined, options?: TransportRequestOptionsWithOutMeta | undefined): Promise<...>', gave the following error.                                   Type '{ price: string; }[] | { createdAt: string; }[] | { orderCount: string; }[] | { _score: string; }[]' is not assignable to type '
Sort | undefined'.                                                                                                                              Type '{ _score: string; }[]' is not assignable to type 'Sort | undefined'.
        Type '{ _score: string; }[]' is not assignable to type 'SortCombinations[]'.
          Type '{ _score: string; }' is not assignable to type 'SortCombinations'.
            Type '{ _score: string; }' is not assignable to type 'SortOptions'.
              Types of property '_score' are incompatible.
                Type 'string' has no properties in common with type 'ScoreSort'.
  Overload 2 of 3, '(this: That, params?: import("c:/Users/Admin/Modulas E-commerce/node_modules/@elastic/elasticsearch/lib/api/types").Se
archRequest | import("c:/Users/Admin/Modulas E-commerce/node_modules/@elastic/elasticsearch/lib/api/typesWithBodyKey").SearchRequest | undefined, options?: TransportRequestOptionsWithMeta | undefined): Promise<...>', gave the following error.                                      Type '{ price: string; }[] | { createdAt: string; }[] | { orderCount: string; }[] | { _score: string; }[]' is not assignable to type '
Sort | undefined'.                                                                                                                              Type '{ _score: string; }[]' is not assignable to type 'Sort | undefined'.
        Type '{ _score: string; }[]' is not assignable to type 'SortCombinations[]'.
          Type '{ _score: string; }' is not assignable to type 'SortCombinations'.
            Type '{ _score: string; }' is not assignable to type 'SortOptions'.
              Types of property '_score' are incompatible.
                Type 'string' has no properties in common with type 'ScoreSort'.
  Overload 3 of 3, '(this: That, params?: import("c:/Users/Admin/Modulas E-commerce/node_modules/@elastic/elasticsearch/lib/api/types").Se
archRequest | import("c:/Users/Admin/Modulas E-commerce/node_modules/@elastic/elasticsearch/lib/api/typesWithBodyKey").SearchRequest | undefined, options?: TransportRequestOptions | undefined): Promise<...>', gave the following error.                                              Type '{ price: string; }[] | { createdAt: string; }[] | { orderCount: string; }[] | { _score: string; }[]' is not assignable to type '
Sort | undefined'.                                                                                                                              Type '{ _score: string; }[]' is not assignable to type 'Sort | undefined'.
        Type '{ _score: string; }[]' is not assignable to type 'SortCombinations[]'.
          Type '{ _score: string; }' is not assignable to type 'SortCombinations'.
            Type '{ _score: string; }' is not assignable to type 'SortOptions'.
              Types of property '_score' are incompatible.
                Type 'string' has no properties in common with type 'ScoreSort'.

61       sort: this.buildSort(dto.sort),
         ~~~~


backend/apps/catalog/src/modules/products/products.service.ts:88:39 - error TS2345: Argument of type 'UpdateProductDto' is not assignable 
to parameter of type '_QueryDeepPartialEntity<Product>'.                                                                                    Types of property 'dimensions' are incompatible.
    Type 'Record<string, unknown> | undefined' is not assignable to type '(() => string) | _QueryDeepPartialEntity<Record<string, unknown>
> | undefined'.                                                                                                                                 Type 'Record<string, unknown>' is not assignable to type '(() => string) | _QueryDeepPartialEntity<Record<string, unknown>> | undefi
ned'.                                                                                                                                     
88     await this.productRepo.update(id, dto);
                                         ~~~

backend/apps/configurator/src/modules/rules/rules.service.ts:4:28 - error TS2307: Cannot find module './entities/module-rule.entity' or it
s corresponding type declarations.
4 import { ModuleRule } from "./entities/module-rule.entity";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/configurator/src/modules/rules/rules.service.ts:5:34 - error TS2307: Cannot find module '../configurations/entities/configure
d-module.entity' or its corresponding type declarations.
5 import { ConfiguredModule } from "../configurations/entities/configured-module.entity";
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/content/src/modules/articles/articles.service.ts:5:25 - error TS2307: Cannot find module './entities/article.entity' or its c
orresponding type declarations.
5 import { Article } from "./entities/article.entity";
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/content/src/modules/articles/articles.service.ts:6:34 - error TS2307: Cannot find module './dto/create-article.dto' or its co
rresponding type declarations.
6 import { CreateArticleDto } from "./dto/create-article.dto";
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/content/src/modules/articles/articles.service.ts:7:34 - error TS2307: Cannot find module './dto/update-article.dto' or its co
rresponding type declarations.
7 import { UpdateArticleDto } from "./dto/update-article.dto";
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/content/src/modules/articles/articles.service.ts:8:33 - error TS2307: Cannot find module './dto/article-query.dto' or its cor
responding type declarations.
8 import { ArticleQueryDto } from "./dto/article-query.dto";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/orders/src/orders.controller.ts:37:15 - error TS2339: Property 'Admin' does not exist on type 'typeof Role'.

37   @Roles(Role.Admin)
                 ~~~~~

backend/apps/orders/src/orders.service.ts:49:28 - error TS2339: Property 'Admin' does not exist on type 'typeof Role'.

49     if (user.role === Role.Admin) {
                              ~~~~~

backend/apps/orders/src/orders.service.ts:70:28 - error TS2339: Property 'Admin' does not exist on type 'typeof Role'.

70     if (user.role !== Role.Admin) {
                              ~~~~~

backend/apps/orders/src/orders.service.ts:93:28 - error TS2339: Property 'Admin' does not exist on type 'typeof Role'.

93     if (user.role !== Role.Admin && order.userId !== user.id) {
                              ~~~~~

backend/apps/vendor/src/modules/vendors/vendors.service.ts:4:24 - error TS2307: Cannot find module './entities/vendor.entity' or its corre
sponding type declarations.
4 import { Vendor } from "./entities/vendor.entity";
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/vendor/src/modules/vendors/vendors.service.ts:5:28 - error TS2307: Cannot find module './entities/vendor-user.entity' or its 
corresponding type declarations.
5 import { VendorUser } from "./entities/vendor-user.entity";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/vendor/src/modules/vendors/vendors.service.ts:6:33 - error TS2307: Cannot find module './dto/create-vendor.dto' or its corres
ponding type declarations.
6 import { CreateVendorDto } from "./dto/create-vendor.dto";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/vendor/src/modules/vendors/vendors.service.ts:7:33 - error TS2307: Cannot find module './dto/update-vendor.dto' or its corres
ponding type declarations.
7 import { UpdateVendorDto } from "./dto/update-vendor.dto";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/workshop/src/modules/workshops/workshops.service.ts:6:26 - error TS2307: Cannot find module './entities/workshop.entity' or i
ts corresponding type declarations.
6 import { Workshop } from "./entities/workshop.entity";
                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/workshop/src/modules/workshops/workshops.service.ts:7:36 - error TS2307: Cannot find module './entities/enrollment.entity' or
 its corresponding type declarations.
7 import { WorkshopEnrollment } from "./entities/enrollment.entity";
                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/workshop/src/modules/workshop/src/modules/workshops/workshops.service.ts:8:29 - error TS2307: Cannot find module './entities/certificate.entity' o
r its corresponding type declarations.
8 import { Certificate } from "./entities/certificate.entity";
                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/workshop/src/modules/workshop/src/modules/workshops/workshops.service.ts:9:35 - error TS2307: Cannot find module './dto/create-workshop.dto' or it
s corresponding type declarations.
9 import { CreateWorkshopDto } from "./dto/create-workshop.dto";
                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~

backend/apps/workshop/src/modules/workshops/workshops.service.ts:10:27 - error TS2307: Cannot find module './dto/enroll.dto' or its corres
ponding type declarations.
10 import { EnrollDto } from "./dto/enroll.dto";
                             ~~~~~~~~~~~~~~~~~~


Found 29 errors in 9 files.

Errors  Files
     5  backend/apps/affiliate/src/modules/commissions/commissions.service.ts:6
     3  backend/apps/catalog/src/modules/products/products.controller.ts:42
     2  backend/apps/catalog/src/modules/products/products.service.ts:61
     2  backend/apps/configurator/src/modules/rules/rules.service.ts:4
     4  backend/apps/content/src/modules/articles/articles.service.ts:5
     1  backend/apps/orders/src/orders.controller.ts:37
     3  backend/apps/orders/src/orders.service.ts:49
     4  backend/apps/vendor/src/modules/vendors/vendors.service.ts:4
     5  backend/apps/workshop/src/modules/workshops/workshops.service.ts:6
```

---

## Frontend Runtime / Dev Server Errors (captured from Next dev logs)

```
Error: Route "/products" used `searchParams.page`. `searchParams` is a Promise and must be unwrapped with `await` or `React.use()` before 
accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis                                                      at ProductGrid (src\components\store\product-grid.tsx:33:36)
  31 | export async function ProductGrid({ searchParams }: ProductGridProps) {
  32 |   const { products, total } = await fetchProducts(searchParams);
> 33 |   const page = Number(searchParams.page ?? 1);
     |                                    ^
  34 |
  35 |   if (products.length === 0) {
  36 |     return (
```

(Repeated runtime messages about `searchParams` being a Promise for pages: `/products`, `/login`, `/signup`, `/blog`, `/courses`, etc.)

```
⨯ Error: Event handlers cannot be passed to Client Component props.
  <button className=... onClick={function onClick} children=...>
                                ^^^^^^^^^^^^^^^^^^
If you need interactivity, consider converting part of this to a Client Component.
```

(Repeated event-handler-to-server-component errors across multiple components.)

```
[TypeError: fetch failed] {
  [cause]: [Error: 4C290000:error:0A000458:SSL routines:ssl3_read_bytes:tlsv1 unrecognized name:openssl\ssl\record\rec_layer_s3.c:918:SSL 
alert number 112                                                                                                                            ] {
    library: 'SSL routines',
    reason: 'tlsv1 unrecognized name',
    code: 'ERR_SSL_TLSV1_UNRECOGNIZED_NAME'
  }
}
```

(Repeated 500s for image fetches from https://assets.modulas.com )

---

## Notes
- This file was created by the assistant and contains verbatim outputs captured during the session. No source code changes were made.

---

End of diagnostics.
