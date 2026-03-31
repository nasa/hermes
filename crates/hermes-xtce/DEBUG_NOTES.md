# XTCE Deserialization Debug Notes

## Problem Summary

The test `test_load_fprime_xtce_full` fails with:
```
Deserialization failed: unexpected `Event::Start("ComparisonList")`
```

## Root Cause

The XTCE XML schema uses a pattern where complex types with `<choice>` elements are generated as Rust enums. However, quick-xml's serde deserializer struggles with enums that are wrapped in parent XML elements.

**XSD Structure:**
```xml
<complexType name="MatchCriteriaType">
    <choice>
        <element name="Comparison" type="..."/>
        <element name="ComparisonList" type="..."/>
        ...
    </choice>
</complexType>

<complexType name="RestrictionCriteriaType">
    <complexContent>
        <extension base="xtce:MatchCriteriaType">
            <choice>
                <element name="NextContainer" type="..."/>
            </choice>
        </extension>
    </complexContent>
</complexType>
```

**Actual XML:**
```xml
<BaseContainer containerRef="CCSDSSpacePacket">
    <RestrictionCriteria>
        <ComparisonList>
            <Comparison parameterRef="..." value="0" />
        </ComparisonList>
    </RestrictionCriteria>
</BaseContainer>
```

**Generated Rust (BROKEN):**
```rust
pub struct BaseContainerType {
    #[serde(rename = "RestrictionCriteria")]
    pub restriction_criteria: Option<RestrictionCriteriaType>,
}

pub enum RestrictionCriteriaType {
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    ...
}
```

The problem: serde expects the enum variant name (`ComparisonList`) to be at the `RestrictionCriteria` element level, but it's actually nested inside.

## Solution Options

### Option 1: Enable ADVANCED_ENUMS (RECOMMENDED)

Modify `build.rs` line 53-58 to enable `ADVANCED_ENUMS`:

```rust
.with_generator_flags(
    GeneratorFlags::all()
        // - GeneratorFlags::ADVANCED_ENUMS  // REMOVE THIS LINE
        - GeneratorFlags::ANY_TYPE_SUPPORT
        - GeneratorFlags::NILLABLE_TYPE_SUPPORT,
)
```

This may cause xsd-parser to generate the correct wrapper pattern automatically.

**To test:** Run `cargo build --features codegen` to regenerate code, then run tests.

### Option 2: Add Post-Processing to build.rs

Add a function similar to `fix_other_unit_variant` that wraps problematic enum types:

```rust
fn wrap_choice_enums(data_types: &mut DataTypes<'_>) {
    // Find types that need wrapping (e.g., RestrictionCriteriaType, MatchCriteriaType)
    // Generate a struct wrapper with:
    //   #[serde(rename = "$value")]
    //   pub content: OriginalEnumType
}
```

Call this in the codegen pipeline after line 77.

### Option 3: Manual Workaround (TEMPORARY)

The fixed pattern should be:

```rust
#[derive(Debug, Deserialize, Serialize)]
pub struct RestrictionCriteriaType {
    #[serde(rename = "$value")]
    pub content: RestrictionCriteriaChoice,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum RestrictionCriteriaChoice {
    #[serde(rename = "ComparisonList")]
    ComparisonList(ComparisonListType),
    // ... other variants
}
```

**Note:** Manual edits to `src/schema/xtce.rs` will be lost when regenerating from XSD.

### Option 4: Use Different XML Parser

Consider alternatives to quick-xml that handle this pattern better:
- `yaserde` - More XSD-aware
- `roxmltree` + custom parsing - More control
- `xmlparser` - Lower level but more flexible

## Test Cases

See `tests/test_fix_demonstration.rs` for a minimal reproduction showing:
- `test_broken_deserialization` - Demonstrates the current issue
- `test_fixed_deserialization` - Shows the working pattern

See `tests/minimal_test.rs` for isolated tests of RestrictionCriteria and BaseContainer.

## Affected Types

The following types likely have the same issue (all use `<choice>` in XSD):
- `MatchCriteriaType`
- `RestrictionCriteriaType`
- Any other types generated from XSD `<choice>` elements

Search the generated code for enums used as fields with `#[serde(rename = "...")]` to find others.

## References

- XSD Schema: `schema/xtce-v1.3.xsd`
- Code Generator: `build.rs` (uses `xsd-parser` crate)
- Generated Code: `src/schema/xtce.rs` (auto-generated, don't edit directly)
- Test Data: `tests/data/fprime.xtce.xml`

## Next Steps

1. Try Option 1 (enable ADVANCED_ENUMS) first
2. If that doesn't work, implement Option 2 (post-processing)
3. Update tests to verify all affected types deserialize correctly
