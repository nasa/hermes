---
icon: fontawesome/solid/pen-fancy
---

# Authoring

Authoring the .hermes.md procedure templates is recommended in VS Code. 
Terms:
* Markdown Block: Manual Instructions or notes for the test operators
* Code Block: Instructions that can be scripts, logic, calculations, or commands to the software like FPrime.
* Section: Uses # to denote different levels of section headers.
* Outline (VS Code): The left pane in VS Code has a feature to show the user the section headers as a way of outlining a document/procedure.

There .md file extension is markdown and follows markdown formating.

Markdown is not the only format used in the procedure. Python, bash, FPrime, and more are all capabilities built into the procedure capability.

When using a FPrime code block, there are additional features that allow for integrated command dictionaries giving suthors real time commands, agruments, argument range validation, and additional argument details.

## :fontawesome-solid-cube: Common Markdown Blocks


### :fontawesome-solid-table-columns: Tables

### :fontawesome-solid-camera: Pictures

### :fontawesome-solid-link: URL Links

### :fontawesome-solid-stairs: Manual Instructs

* Denotes a manual action to be taken by the operator
* Examples: Take Picture with camera, open hand valve, move hardware, etc.

``` py
<span style="color:green"> **MANUAL INSTRUCT:**</span> 
```
:fontawesome-solid-arrow-down:  Looks like :fontawesome-solid-arrow-down:

<span style="color:green"> **MANUAL INSTRUCT:**</span> 

### :fontawesome-solid-text-slash: Redlines

* Red Lines are used to document a deviation from the approved procedural steps. These are critical to repeating tests effectively and understanding if an anomaly is due to test response, procedural error, or operator error. 
* The Start Redline has a title header while the End Redline does not.
    * This is to accomodate the collapse-hierarchy in the outline function in VS Code.

``` py 
##### <span style="color:red"> **REDLINE_START:** </span>
```
``` py 

<span style="color:red"> **REDLINE_STOP:** </span> 

``` 
:fontawesome-solid-arrow-down:  Looks like :fontawesome-solid-arrow-down:

<span style="color:red"> **REDLINE_START:** </span> 

<span style="color:red"> **REDLINE_STOP:** </span>

### :fontawesome-solid-note-sticky: Notes

### :fontawesome-solid-compact-disc: Record

## :fontawesome-solid-terminal: Common Code Blocks

### :fontawesome-solid-satellite-dish: Flight Commands

### :fontawesome-brands-python: Python Scripts

### :fontawesome-solid-code: Bash Scripts



!!! question "FAQs"

!!! warning "Documentation In Progress"

    This documentation is incomplete while we are migrating from our internal documentation store to the public GitHub.

   


This is new Content