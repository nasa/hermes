# SPICE

See https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/kernel.html for kernel specification.

## SCLK

The sclk package implements a subset of the NAIF SPICE
functionality for SCLK time conversions.

See https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/FORTRAN/req/sclk.html
for full specification on what sclk is and how it's used on spacecrafts for
time conversions to/from other time systems.

### Brief overview

Spacecraft Clock (SCLK) is an increasing counter used to derive the majority
of timing functionality on-board a spacecraft. The most relevant excerpt from
the NAIF SCLK document:

> Most of the complexity of dealing with SCLK time values arises from the fact that the rate at which any spacecraft clock runs varies over time. As a consequence, the relationship between SCLK and ET or UTC is not accurately described by a linear function; usually, a piecewise linear function is used to model this relationship.
> 
> The mapping that models the relationship between SCLK and other time systems is updated as a mission progresses. While the change in the relationship between SCLK and other systems will usually be small, you should be aware that it exists; it may be a cause of discrepancies between results produced by different sets of software.
