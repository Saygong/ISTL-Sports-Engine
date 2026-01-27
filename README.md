# README

## ISTL-Sports-Engine
The Italian Supreme Tennis League (ISTL, a fictitious organization) aims to unify and simplify the management of
racket-based tournaments, including, but not limited to, tennis, padel, table tennis, and similar sports.

## Shared database
The database is shared between the monolithic and distributed architectures, so all the data prepared for a quick
project overview can be viewed from both the monolithic and distributed architectures. Database access is particularly
slow. Furthermore, queries have not been optimized, so displaying data can take a long time.

## Repository structure
This repository is structured to easily distinguish between code used for the monolithic architecture and that used for
the distributed architecture. To do this, two different branches are used:

- Monolith branch: https://github.com/Saygong/ISTL-Sports-Engine/tree/monolith/main
- Distributed branch: https://github.com/Saygong/ISTL-Sports-Engine/tree/distributed/main