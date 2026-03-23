---
icon: fontawesome/solid/database
---

# Datastores

Unlike many ground data systems for space missions, Hermes does not
ship with a builtin data persistence solution. Data storage is not
a goal of the Hermes project. For this purpose, Hermes relies on
an external provider to store its time series data. There are a number
of databases that Hermes supports, each with their own use cases.

This document will attempt to provide guidance to system architects
on how to design and deploy a ground system topology.

## Data Model

Before we discuss the Hermes supported datastores, it is important to
discuss the data model of Hermes. Hermes uses a generic data representation
which can be converted to a chosen database representation. It is also
important to note that Hermes does not persist any data in the backend.
A plugin can be either built directly into the backend or attached via
the [gRPC API](https://grpc.io).
