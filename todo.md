## Nest.js API TODO

Development planning

## Accounts

- create
- get
- get/:id
- update
- delete

## Roles

- create
- get
- get/:id
- update
- delete

## Assingments

Account to role assingment

- create (accountId, roleId)
- get
- get/:accountId
- delete

## Payments

TODO:

- addPayment
  - add utility service ex: water, gas, electricity
  - print payment receipt and store it in database
- getPayment /:accountId
- getPaymentReceipts /:accountId
- getReceipt /:id

## Database Models

Accounts - schema
Role - schema
User role relation - schema
Role - schema
User - schema
Payment - schema

## Authentication & Authorization

- authenticate account
- authorize account
- implement role based access control (RBAC)

## Logging

- implement logging for each operation

## NICE TO HAVE

## Docker

- add docker

## TESTS

- add tests coverage
