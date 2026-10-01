package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

// Ordered to match parameter_values_param_member_time_idx: one index probe
// per chunk. Ordering by generation_time alone, or max(), walks the time
// index through every newer row of other parameters instead. Members of a
// value share its generation time, so the first member path's newest time is
// the parameter's; if that member was missing from the newest value, the
// result is older, never newer.
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
// parameter of instance. Parameters without stored values are left out.
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
