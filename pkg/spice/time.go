package spice

import (
	"math"
	"slices"
	"time"
)

type TimeSystemKind int

const (
	TimeSystem_TDB = 1
	TimeSystem_TT  = 2
)

// Barycentric Dynamical Time (ET), is the independent argument
// of ephemerides and dynamical theories that are referred to the
// solar system barycenter. ET varies from TT only by periodic variations.
//
// ET is believed to be in agreement with the time that would be kept by
// an atomic clock located at the solar system barycenter (SSB). A comparison
// of the times kept by a clock at the solar system barycenter with a ET clock
// on earth would reveal that the two clocks are in close agreement but that they
// run at different rates at different times of the year.
// This is due to relativistic effects.
//
// At some times in the year the TT clock appears to run fast when compared to
// the ET clock, at other times of the year it appears to run slow. Let TDB0 be
// some fixed epoch on the ET clock and TT0 be a fixed epoch on the TT clock
// (TDB0 and TT0 do not necessarily have to be the same epoch). Any epoch,
// EPOCH, can be represented in the following ways: as the number of seconds ET(EPOCH),
// that have elapsed since TDB0 on the ET clock; or as the number of seconds, TT(EPOCH),
// that have elapsed since TT0 on the TT clock. If we plot the differences
// ET(EPOCH) - TT(EPOCH) against ET(EPOCH) over all epochs, we will find that the graph
// is very close to a periodic function.
//
// In SPICE the difference between TT and ET is computed as follows:
//
//	ET - TT =  K * sin (E)                  (1)
//
// where K is a constant, and E is the eccentric anomaly of the heliocentric orbit of the Earth-Moon barycenter. This difference, which ignores small-period fluctuations, is accurate to about 0.000030 seconds. To five decimal places the difference between TT and ET is a periodic function with magnitude approximately 0.001658 seconds and period equal to one sidereal year.
//
// The eccentric anomaly E is given by
//
//	E = M + EB sin (M)                         (2)
//
// where EB and M are the eccentricity and mean anomaly of the heliocentric orbit of the Earth-Moon barycenter. The mean anomaly is in turn given by
//
//	M = M0 + M1*t                              (3)
//
// where t is the epoch ET expressed in barycentric dynamical seconds past the epoch of J2000.
type ET float64

// Convert TDB -> TT
func (t ET) TT() TT {
	/*        What we have to do here is invert the formula used to get */
	/*        TDB from TDT that was used above. */

	/*        Of course solving the equation */

	/*           TDB = TDT + K*SIN { M0 + M1*TDT + EB*SIN( MO + M1*TDT ) } */

	/*        analytically for TDT if given TDB is no piece of cake. */
	/*        However, we can get as close as we want to TDT if */
	/*        we notice a few tricks.  First, let's let f(t) denote the */
	/*        function */

	/*           f(t) = SIN( M0 + M1*t + EB*SIN( M0 + M1*t ) ) */

	/*        With this simpler notation we can rewrite our problem */
	/*        as that of solving the equation */

	/*           y = t + K*f(t) */

	/*        for t given y.  Whichever t satisfies this equation will be */
	/*        unique. The uniqueness of the solution is ensured because the */
	/*        expression on the right-hand side of the equation is */
	/*        monotone increasing in t. */

	/*        Let's suppose that t is the solution, then the following */
	/*        is true. */

	/*           t = y - K*f(t) */

	/*        but we can also replace the t on the right hand side of the */
	/*        equation by y - K*f(t).  Thus */

	/*           t = y - K*f( y - K*f(t)) */

	/*             = y - K*f( y - K*f( y - K*f(t))) */

	/*             = y - K*f( y - K*f( y - K*f( y - K*f(t)))) */

	/*             = y - K*f( y - K*f( y - K*f( y - K*f( y - K*f(t))))) */
	/*             . */
	/*             . */
	/*             . */
	/*             = y - K*f( y - K*f( y - K*f( y - K*f( y - K*f(y - ... ))) */

	/*        and so on, for as long as we have patience to perform the */
	/*        substitutions. */

	/*        The point of doing this recursive substitution is that we */
	/*        hope to move t to an insignificant part of the computation. */
	/*        This would seem to have a reasonable chance of success since */
	/*        K is a small number and f is bounded by 1. */

	/*        Following this idea, we will attempt to solve for t using */
	/*        the recursive method outlined below. */

	/*        We will make our first guess at t, call it t_0. */

	/*         t_0 = y */

	/*        Our next guess, t_1, is given by: */

	/*         t_1 = y - K*f(t_0) */

	/*        And so on: */

	/*         t_2 = y - K*f(t_1)        [ = y - K*f(y - K*f(y))            ] */
	/*         t_3 = y - K*f(t_2)        [ = y - K*f(y - K*f(y - K*f(y)))   ] */
	/*             . */
	/*             . */
	/*             . */
	/*         t_n = y - K*f(t_(n-1))    [ = y - K*f(y - K*f(y - K*f(y...)))] */

	/*        The questions to ask at this point are: */

	/*           1) Do the t_i's converge? */
	/*           2) If they converge, do they converge to t? */
	/*           3) If they converge to t, how fast do they get there? */

	/*        1) The sequence of approximations converges. */

	/*           | t_n - t_(n-1) | =    [ y - K*f( t_(n-1) ) ] */
	/*                               -  [ y - K*f( t_(n-2) ) ] */

	/*                             =  K*[ f( t_(n-2) ) - f( t_(n-1) ) ] */

	/*           The function f has an important property. The absolute */
	/*           value of its derivative is always less than M1*(1+EB). */
	/*           This means that for any pair of real numbers s,t */

	/*              | f(t) - f(s) |  < M1*(1+EB)*| t - s |. */

	/*           From this observation, we can see that */

	/*             | t_n - t_(n-1) | < K*M1*(1+EB)*| t_(n-1) - t_(n-2) | */

	/*           With this fact available, we could (with a bit more work) */
	/*           conclude that the sequence of t_i's converges and that */
	/*           it converges at a rate that is at least as fast as the */
	/*           sequence L, L**2, L**3, .... */

	/*           Where L = K*M1*(1+EB) << 1. */

	/*         2) If we let t be the limit of the t_i's then it follows */
	/*            that */

	/*               t = y - K*f(t). */

	/*            or that */

	/*               y = t + K*f(t). */

	/*         3) As we already pointed out, the sequence of t_i's */
	/*            converges at least as fast as the geometric series */
	/*            L, L**2, ... */

	/*        Since K*M1*(1+EB) is quite small (on the order of 10**-9) */
	/*        3 iterations should get us as close as we can get to the */
	/*        solution for TDT */

	K := det.K
	EB := det.EB
	M := det.M

	tdb := float64(t)
	tdt := tdb
	for range 3 {
		m := M[0] + M[1]*tdt
		e := m + EB*math.Sin(m)
		tdt = tdb - K*math.Sin(e)
	}

	return TT(tdt)
}

// Terrestrial Time (TT), (or Terrestrial Dynamical Time, TDT),
// with unit of duration 86400 SI seconds on the geoid, is the
// independent argument of apparent geocentric ephemerides.
// TT = TAI + 32.184 seconds.
//
// The basic spatial reference system for SPICE is the J2000 system.
// This is an inertial reference frame in which the equations of motion
// for the solar system may be integrated. This reference frame is
// specified by the orientation of the earth's mean equator and equinox
// at a particular epoch --- the J2000 epoch. This epoch is Greenwich noon
// on January 1, 2000 Barycentric Dynamical Time (TDB). Throughout the SPICE
// documentation you will see the expressions:
//
//	“seconds past 2000”; “seconds past J2000”; or “seconds past the J2000 epoch.”
//
// In all cases, the reference epoch is noon January 1, 2000 on a particular time scale.
type TT float64

// Convert TT (TDT) to TDB (ET)
func (t TT) ET() ET {
	tdt := float64(t)

	K := det.K
	EB := det.EB
	M := det.M

	// CSPICE:
	// tdb = tdt + k * sin(m[0] + m[1] * tdt + eb * sin(m[0] + m[1] * tdt));
	m := M[0] + M[1]*tdt
	e := m + EB*math.Sin(m)
	return ET(tdt + K*math.Sin(e))
}

func (t TT) TAI() TAI {
	return TAI(t) - tt_tai
}

// Internation Atomic Time
type TAI float64

// TT implements Time.
func (t TAI) TT() TT {
	return TT(t + tt_tai)
}

// UTC implements Time.
func (t TAI) UTC() UTC {
	// Convert floating point TAI time to a duration (after epoch)
	// Doing this conversion in two steps will reduce floating point errors
	taiS := int64(t)
	taiNS := int64((float64(t) - float64(taiS)) * 1e9)

	// Find the leap second bucket where we lie
	idx, _ := slices.BinarySearch(leapseconds.TaiTime, taiS)
	idx -= 1

	var utcS int64

	// Apply the leap seconds if we're in a valid range
	if idx >= 0 {
		utcS = taiS - leapseconds.UtcTai[idx]
	} else {
		// We're outside any defined windows just use 0 leap seconds
		utcS = taiS
	}

	return UTC{
		Seconds: utcS,
		Nanos:   taiNS,
	}
}

// Universal Coordinated Time
type UTC struct {
	Seconds int64
	Nanos   int64
}

// J2000 implements Time.
func (u UTC) J2000() float64 {
	return float64(u.Seconds) + (float64(u.Nanos) / 1e9)
}

// TAI implements Time.
func (u UTC) TAI() TAI {
	// Find the leap second bucket where we lie
	idx, _ := slices.BinarySearch(leapseconds.UtcTime, u.Seconds)
	idx -= 1

	var taiS int64

	// Apply the leap seconds if we're in a valid range
	if idx >= 0 {
		taiS = u.Seconds + leapseconds.UtcTai[idx]
	} else {
		// We're outside any defined windows just use 0 leap seconds
		taiS = u.Seconds
	}

	return TAI(taiS) + TAI(float64(u.Nanos)/1e9)
}

// Time implements Time.
func (u UTC) Time() time.Time {
	return time.Unix(u.Seconds+UtcAtJ2000, u.Nanos).UTC()
}

func UTCFromTime(t time.Time) UTC {
	return UTC{
		Seconds: t.Unix() - UtcAtJ2000,
		Nanos:   int64(t.Nanosecond()),
	}
}

func FromTime[T ~float64](t time.Time) T {
	s := t.Unix() - UtcAtJ2000
	return T(s) + (T(t.Nanosecond()) / 1e9)
}

// Convert SPICE encoded time to Go encoded time
// Assume F64 is on J2000 epoch
func ToTime[T ~float64](f T) time.Time {
	s := int64(f)
	ns := int64((float64(f) - float64(s)) * 1e9)

	return time.Unix(s+UtcAtJ2000, ns).UTC()
}
