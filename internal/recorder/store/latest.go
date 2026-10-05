package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

// A struct or array value is stored as one row per member, all with the value's
// generation time, so the newest row of a single member path is enough. We use
// the alphabetically first member path, such as [0] for an array, because
// ordering by member_path and then generation_time matches
// parameter_values_param_member_generation_idx and needs one index lookup per
// daily chunk. Ordering by generation_time alone, or taking
// max(generation_time), walks TimescaleDB's own generation_time index past
// every other parameter's newer rows, and a GROUP BY over the table reads
// every row.
const latestGenerationTimesSQL = `SELECT p.space_system, p.name, v.generation_time
	FROM parameters p
	CROSS JOIN LATERAL (
		SELECT generation_time FROM parameter_values
		WHERE parameter_id = p.id
		ORDER BY member_path, generation_time DESC
		LIMIT 1
	) v
	WHERE p.instance = $1`

// LatestGenerationTimes returns the newest stored generation time of each
// parameter in instance, leaving out parameters with nothing stored. YAMCS
// re-sends each parameter's last value when a subscription opens, and the
// recorder uses these times at startup to skip the ones an earlier run stored.
// If a parameter's newest value has no row for its alphabetically first member
// path, for example a struct member YAMCS sent without a value, we return an
// older time and the recorder stores that re-sent value once more.
func LatestGenerationTimes(ctx context.Context, db *sql.DB, instance string) (map[Parameter]time.Time, error) {
	rows, err := db.QueryContext(ctx, latestGenerationTimesSQL, instance)
	if err != nil {
		return nil, fmt.Errorf("failed to query latest generation times: %w", err)
	}
	defer rows.Close()

	latest := make(map[Parameter]time.Time)
	for rows.Next() {
		p := Parameter{Instance: instance}
		var t time.Time
		if err := rows.Scan(&p.SpaceSystem, &p.Name, &t); err != nil {
			return nil, fmt.Errorf("failed to read latest generation time: %w", err)
		}
		latest[p] = t
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("failed to read latest generation times: %w", err)
	}
	return latest, nil
}
