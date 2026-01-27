# README

## ISTL-Sports-Engine
The Italian Supreme Tennis League (ISTL - that is a fictional organization) wants to unify and streamline the management of racquet based tournaments,
including but not limited to tennis, padel, table tennis and similar sports.
Its primary goal is to create an integrated IT system that is capable of managing
the entire lifecycle of an event such as a tournament, from player registration  to final rankings.

## Shared database
The database is shared between the monolithic and distributed architectures, so all the data prepared for a quick
project overview can be viewed from both the monolithic and distributed architectures.
The database is deployed on a virtual machine hosted in AWS North Virginia, so access can be slightly slower at times,
but not in a way that will detract from using or enjoying the application.


## Repository structure
This repository is structured to easily distinguish between code used for the monolithic architecture and that used for
the distributed architecture.

The following links point to the branches corresponding to the two architectural samples,
each containing additional information about the architecture and instructions on how to run the project.

- Monolith branch: https://github.com/Saygong/ISTL-Sports-Engine/tree/monolith/main
- Distributed branch: https://github.com/Saygong/ISTL-Sports-Engine/tree/distributed/main