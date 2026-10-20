package store

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

// A parameter has one parameters row per member and value type. We find the
// newest value of each row, which is one lookup in
// parameter_values_param_generation_idx starting at the newest chunk, and keep
// the newest per parameter. Joining the two tables and grouping by parameter
// would read every stored value instead.
const latestGenerationTimesSQL = `SELECT p.space_system, p.name, max(v.generation_time)
	FROM parameters p
	CROSS JOIN LATERAL (
		SELECT generation_time FROM parameter_values
		WHERE parameter_id = p.id
		ORDER BY generation_time DESC
		LIMIT 1
	) v
	WHERE p.instance = $1
	GROUP BY p.space_system, p.name`

// LatestGenerationTimes returns the newest stored generation time of each
// parameter in instance, leaving out parameters with nothing stored. YAMCS
// re-sends each parameter's last value when a subscription opens, and the
// recorder uses these times at startup to skip the ones an earlier run stored.
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
