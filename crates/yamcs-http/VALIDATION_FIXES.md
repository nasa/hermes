# YAMCS HTTP Client Validation Fixes

This document summarizes all fixes applied to align the Rust YAMCS client with the TypeScript implementation.

## Summary

**Total Issues Fixed: 10 + 2 improvements**

All endpoints, request parameters, and response handling have been validated against the TypeScript implementation in `src/extensions/yamcs/src/client/YamcsClient.ts`.

---

## Issues Fixed

### Issue #1: System Info Endpoint ✅
**Location**: `client.rs:196-198`

**Problem**: Incorrect endpoint path
- **Before**: `/api/system-info`
- **After**: `/api/sysinfo`

**Fix**: Changed endpoint to match TypeScript implementation.

---

### Issue #2: Algorithm Status Endpoint ✅
**Location**: `client.rs:302-312`

**Problem**: Missing `/status` suffix in endpoint
- **Before**: `/api/processors/{instance}/{processor}/algorithms{qualified_name}`
- **After**: `/api/processors/{instance}/{processor}/algorithms{qualified_name}/status`

**Fix**: Added `/status` suffix to endpoint.

---

### Issue #3: Command History Methods ✅
**Location**: `client.rs:346-370`

**Problem**: Incorrect processor parameter handling
- `get_command_history`: Removed `processor` parameter (should be in options if needed)
- `get_command_history_entry`: Removed `processor` parameter

**Before**:
```rust
get_command_history(&self, instance: &str, processor: &str, options: ...)
    -> "/api/archive/{}/commands?processor={}&{}"

get_command_history_entry(&self, instance: &str, processor: &str, command_id: &str)
    -> "/api/archive/{}/commands/{}?processor={}"
```

**After**:
```rust
get_command_history(&self, instance: &str, options: ...)
    -> "/api/archive/{}/commands?{}"

get_command_history_entry(&self, instance: &str, command_id: &str)
    -> "/api/archive/{}/commands/{}"
```

**Fix**: Removed processor from method signatures and URL construction.

---

### Issue #4: Issue Command Endpoint ✅
**Location**: `client.rs:331-343`

**Problem**: Missing `/` separator and URL encoding
- **Before**: `/api/processors/{instance}/{processor}/commands{command}`
- **After**: `/api/processors/{instance}/{processor}/commands/{urlEncode(command)}`

**Fix**: Added `/` separator and URL encoding using `urlencoding::encode()`.

---

### Issue #5: Parameter Archive Methods ✅
**Location**: `client.rs:372-419`

**Problem**: All three methods had incorrect endpoints with processor in path

**Methods Fixed**:

#### `get_parameter_values`
- **Before**: Takes `processor` param, uses `/api/archive/{}/parameters/{processor}/samples`
- **After**: Takes `qualified_name`, uses `/api/archive/{}/parameters{qualified_name}`
- Added wrapper deserialization for `ParameterData { parameter: Vec<...> }`

#### `get_parameter_samples`
- **Before**: `/api/archive/{}/parameters/{processor}{parameter}/samples`
- **After**: `/api/archive/{}/parameters{qualified_name}/samples`
- Added wrapper deserialization for `SamplesWrapper { sample: Vec<...> }`

#### `get_parameter_ranges`
- **Before**: `/api/archive/{}/parameters/{processor}{parameter}/ranges`
- **After**: `/api/archive/{}/parameters{qualified_name}/ranges`
- Added wrapper deserialization for `RangesWrapper { range: Vec<...> }`

**Fix**: Removed processor from all parameter archive methods and added proper response wrappers.

---

### Issue #6: Get Packets Method ✅
**Location**: `client.rs:421-429`

**Problem**: Wrong HTTP method and endpoint
- **Before**: `GET /api/archive/{instance}/packets?{query}`
- **After**: `POST /api/archive/{instance}/packets:list` with JSON body

**Fix**: Changed from GET with query string to POST with `:list` endpoint.

---

### Issue #7: Get Events Method ✅
**Location**: `client.rs:467-475`

**Problem**: Wrong HTTP method and endpoint
- **Before**: `GET /api/archive/{instance}/events?{query}`
- **After**: `POST /api/archive/{instance}/events:list` with JSON body

**Fix**: Changed from GET with query string to POST with `:list` endpoint and added wrapper deserialization for `EventsWrapper { event: Vec<...> }`.

---

### Issue #8: Alarm Action Methods ✅
**Location**: `client.rs:528-601`

**Problem**: Sequence number in wrong location (query param vs path)

**Methods Fixed**:
- `acknowledge_alarm`
- `shelve_alarm`
- `unshelve_alarm`
- `clear_alarm`

**Before**: `/api/processors/{}/{}/alarms{}:action?seqnum={}`
**After**: `/api/processors/{}/{}/alarms{}/{}:action`

**Fix**: Moved sequence number from query parameter to path segment.

---

### Issue #9: Get Processors Response Handling ✅
**Location**: `client.rs:439-447`

**Problem**: Direct deserialization instead of wrapper
- **Before**: Deserializes directly to `Vec<Processor>`
- **After**: Deserializes to `ProcessorsWrapper { processors: Option<Vec<...>> }`

**Fix**: Added wrapper structure to match API response format.

---

### Issue #10: WebSocket Subscription Type ✅
**Location**: `client.rs:848-850`

**Problem**: Incorrect subscription type format
- **Before**: `"globalAlarmStatus"` (camelCase)
- **After**: `"global-alarm-status"` (kebab-case)

**Fix**: Changed subscription type to match TypeScript implementation.

---

## Additional Improvements

### Improvement #1: Get Active Alarms Options ✅
**Location**: `client.rs:501-516`

**Enhancement**: Added `options` parameter to match TypeScript implementation
- **Before**: No options parameter
- **After**: Added `options: &GetAlarmsOptions` parameter with query string support

**Fix**: Added options parameter and made response wrapper optional-aware.

---

### Improvement #2: Get Alarms Response Wrapper ✅
**Location**: `client.rs:518-531`

**Enhancement**: Added proper response wrapper deserialization
- **Before**: Direct deserialization to `Vec<Alarm>`
- **After**: Deserializes through `AlarmsWrapper { alarms: Option<Vec<...>> }`

**Fix**: Added wrapper structure with optional handling.

---

### Improvement #3: Get Event Sources Response Field ✅
**Location**: `client.rs:487-495`

**Enhancement**: Fixed response field name
- **Before**: `source: Vec<String>`
- **After**: `sources: Option<Vec<String>>`

**Fix**: Changed field name from singular to plural and made it optional.

---

## Validation Results

All methods have been validated against the TypeScript implementation:

✅ System/Auth APIs (4 methods)
✅ Mission Database APIs (12 methods)
✅ Real-time Operations APIs (9 methods)
✅ Event APIs (3 methods)
✅ Alarm APIs (7 methods)
✅ Instance APIs (2 methods)
✅ WebSocket Subscription APIs (4 methods)

**Total Methods Validated: 41**

## Build Status

```bash
$ cargo check -p yamcs-http
    Checking yamcs-http v4.1.0-a1
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 2.53s
```

✅ All fixes compile successfully with no errors or warnings.

---

## Breaking Changes

The following methods have **breaking changes** to their signatures:

1. **`get_command_history`** - Removed `processor: &str` parameter
2. **`get_command_history_entry`** - Removed `processor: &str` parameter
3. **`get_parameter_values`** - Changed from `(instance, processor, parameters[])` to `(instance, qualified_name, options)`
4. **`get_parameter_samples`** - Changed `processor` parameter to `qualified_name`
5. **`get_parameter_ranges`** - Changed `processor` parameter to `qualified_name`
6. **`get_active_alarms`** - Added `options` parameter

**Migration Guide**: Users of the Rust client will need to update their code:
- Remove processor arguments where they were removed
- Change from processor + parameter to qualified_name for archive methods
- Add default options for `get_active_alarms` if not using filters

---

## Testing Recommendations

1. Test all modified endpoints against a live YAMCS server
2. Verify WebSocket subscriptions work with the corrected subscription types
3. Validate response deserialization with actual API responses
4. Test edge cases with empty/missing wrapper fields (using `unwrap_or_default()`)
5. Verify URL encoding works correctly for special characters in command names

---

**Date**: 2026-03-27
**Validator**: Claude Code
**Status**: ✅ All issues resolved and validated
