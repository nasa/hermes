KPL/FK

M2020 Frames Kernel
========================================================================

   This frame kernel contains complete set of frame definitions for
   Mars 2020 (M2020) including definitions for the M2020 cruise,
   descent, and rover frames, local level, topocentric and
   surface-fixed frames, appendage frames, and science instrument
   frames.


Version and Date
========================================================================

   Version 0.2 -- January 7, 2019 -- Boris Semenov, NAIF

      Added antenna frames and name/ID mappings (except for HGA)
 
   Version 0.0 -- July 16, 2018 -- Boris Semenov, NAIF

      Preliminary version.
 

References
========================================================================

   1. ``Frames Required Reading''

   2. ``Kernel Pool Required Reading''

   3. ``C-Kernel Required Reading''

   4. M2020 3PCS document, latest version

   5. MARS 2020 Telecommunications Design Control Document; D-96537
      February 14, 2017



Contact Information
========================================================================

   Boris V. Semenov, NAIF/JPL, (818)-354-8136, Boris.Semenov@jpl.nasa.gov


Implementation Notes
========================================================================

   This file is used by the SPICE system as follows: programs that make
   use of this frame kernel must `load' the kernel using SPICE routine
   FURNSH, normally during program initialization.
 
   This file was created and may be updated with a text editor or word
   processor.


M2020 NAIF ID Codes
========================================================================

   The following names and NAIF ID codes are assigned to the M2020 rover,
   its structures and science instruments (the keywords implementing
   these definitions are located in the section "M2020 Mission NAIF ID
   Codes -- Definition Section" at the end of this file):
 
   Landing site and sites:
   -----------------------

      M2020_LANDING_SITE         -168900

      M2020_SITE_1...399         -168501...-168899

   Cruise and descent stages and the rover:
   ----------------------------------------

      M2020                      -168

      M2020_ROVER                -168000

      M2020_SPACECRAFT           -168010
      M2020_CRUISE_STAGE         -168020
      M2020_DESCENT_STAGE        -168030
      M2020_ROVER_MECH           -168040
      M2020_CACS                 -168050

   Instruments and structures on cruise and descent modules:
   ---------------------------------------------------------

      M2020_PLGA                 -168060
      M2020_TLGA                 -168061
      M2020_PUHF                 -168062
      M2020_CMGA                 -168063

      M2020_DLGA                 -168064
      M2020_DUHF                 -168065

   Instruments and devices on the rover:
   --------------------------------------

      M2020_RLGA                 -168110
      M2020_RUHF                 -168111


M2020 Frames
========================================================================

   The following M2020 frames are defined in this kernel file:

           Name                        Relative to           Type    NAIF ID
      ======================       ===================       =====   =======

   Surface frames:
   ---------------

      M2020_TOPO                   IAU_MARS                  FIXED   -168900
      M2020_LOCAL_LEVEL            M2020_TOPO                FIXED   -168910
      M2020_SURFACE_FIXED          M2020_LOCAL_LEVEL         FIXED   -168920

   Rover frames:
   -------------

      M2020_ROVER                  J2000, M2020_LOCAL_LEVEL  CK      -168000
      M2020_ROVER_MECH             M2020_ROVER               FIXED   -168040

   Cruise and Descent frames:
   --------------------------

      M2020_SPACECRAFT             M2020_ROVER               FIXED   -168010
      M2020_CRUISE_STAGE           M2020_ROVER               FIXED   -168020
      M2020_DESCENT_STAGE          M2020_ROVER               FIXED   -168030
      M2020_CACS                   J2000, M2020_ROVER        CK      -168050

   Cruise and Descent Antenna frames:
   ----------------------------------

      M2020_PLGA                   M2020_CRUISE_STAGE        FIXED   -168060
      M2020_TLGA                   M2020_CRUISE_STAGE        FIXED   -168061
      M2020_PUHF                   M2020_CRUISE_STAGE        FIXED   -168062
      M2020_CMGA                   M2020_CRUISE_STAGE        FIXED   -168063

      M2020_DLGA                   M2020_DESCENT_STAGE       FIXED   -168064
      M2020_DUHF                   M2020_DESCENT_STAGE       FIXED   -168065

   Rover instrument and structures frames:
   ---------------------------------------

      M2020_RLGA                   M2020_ROVER               FIXED   -168110
      M2020_RUHF                   M2020_ROVER               FIXED   -168111


M2020 Frame Tree
========================================================================

   The diagram below shows the M2020 frame hierarchy:


                                   "J2000" 
                      +---------------------------------+
                      |               |<-pck            |<-pck
                      |               v                 v
                      |          "IAU_MARS"       "IAU_EARTH"
                      |          ----------       -----------
                      |               |<-fixed      
                      |               v             
                      |          "M2020_TOPO"      "M2020_SURFACE_FIXED"
                      |          ------------      ---------------------
                      |               |<-fixed          ^<-fixed
                      |               v                 |
                      |       "M2020_LOCAL_LEVEL"       |
                      |       --------------------------+
                      |               |                      
                      |               |                   "M2020_DLGA/DUHF"
                      |               |                   -----------------
                      |               |                       fixed-> ^
                      |               |                               |
                      |               |                               |
                      |               |  "M2020_PLGA/TLGA/PUHF/CMGA"  |
                      |               |  ---------------------------  |
                      |               |               fixed-> ^       |
                      |               |                       |       |
                      |               |  "M2020_SPACECRAFT"   |       |
                      |               |  ------------------   |       |
                      |               |     ^ <-fixed         |       |
                      |               |     |                 |       |
                      |               |     |   "M2020_CRUISE_STAGE"  |
                      |               |     |   --------------------  |
                      |               |     |     ^ <-fixed           |
                      |               |     |     |                   |
                      |               |     |     |   "M2020_DESCENT_STAGE"
                      |               |     |     |   --------------------
                 ck-> |               |     |     |     ^ <-fixed
                      |               |     |     |     |
                 "M2020_CACS"         |     |     |     |  "M2020_ROVER_MECH"
                 ------------         |     |     |     |  ------------------
                      ^               |     |     |     |     ^ <-fixed
                 ck-> |          ck-> |     |     |     |     |             
                      v               v                      
                                 "M2020_ROVER"
     +--------------------------------------------------------------+


   
M2020 Surface Frames
========================================================================

   The surface frames layout in this version of the FK is based on the
   assumption that the total traverse distance during the mission will
   be relatively short (hundreds of meters, not kilometers) and,
   therefore, the local north and nadir directions, defining surface
   frame orientations, will be approximately the same at any point
   along the traverse path. This assumption allows defining surface
   frames as fixed offset frames with respect to each other and/or to
   Mars body-fixed frame, IAU_MARS.


Topocentric Frame
-------------------------------------------------

   M2020 topocentric frame, M2020_TOPO, is defined as follows:

      -  +Z axis is along the outward normal at the landing site
         ("zenith");
 
      -  +X axis is along the local north direction ("north");
 
      -  +Y axis completes the right hand frame ("west");
 
      -  the origin of this frame is located at the landing site.

   Orientation of the frame is given relative to the body fixed
   rotating frame 'IAU_MARS' (x - along the line of zero longitude
   intersecting the equator, z - along the spin axis, y - completing
   the right hand coordinate frame.)
 
   The transformation from 'M2020_TOPO' frame to 'IAU_MARS' frame is a
   3-2-3 rotation with defined angles as the negative of the site
   longitude, the negative of the site co-latitude, 180 degrees.
 
   Currently an instance of this frame specific for a particular target
   landing site is defined in a separate FK named according to the
   m2020_tp_III_iau2000_vX.tf pattern, when III is the site ID and V is
   the file version.


Local Level Frame
-------------------------------------------------

   M2020 local level frame, M2020_LOCAL_LEVEL, is defined as follows:

      -  +Z axis is along the downward normal at the landing site
         ("nadir");
 
      -  +X axis is along the local north direction ("north");
 
      -  +Y axis completes the right hand frame ("east");
 
      -  the origin of this frame is located between the rover's middle
         wheels and moves with the rover.
 
   Since this frame is essentially the M2020_TOPO frame flipped by 180
   degrees about +X ("north") to point +Z down, this frame is defined
   as a fixed offset frame with respect to the M2020_TOPO frame.

   \begindata

      FRAME_M2020_LOCAL_LEVEL          = -168910
      FRAME_-168910_NAME               = 'M2020_LOCAL_LEVEL'
      FRAME_-168910_CLASS              = 4
      FRAME_-168910_CLASS_ID           = -168910
      FRAME_-168910_CENTER             = -168900
      TKFRAME_-168910_RELATIVE         = 'M2020_TOPO'
      TKFRAME_-168910_SPEC             = 'ANGLES'
      TKFRAME_-168910_UNITS            = 'DEGREES'
      TKFRAME_-168910_AXES             = (   1,       2,       3     )
      TKFRAME_-168910_ANGLES           = ( 180.000,   0.000,   0.000 )

   \begintext


Surface Fixed Frame
-------------------------------------------------

   M2020 surface fixed frame -- M2020_SURFACE_FIXED -- is nominally
   co-aligned in orientation with the M2020_LOCAL_LEVEL frame but its
   origin does not move during the mission. Therefore, this frame is
   defined as a zero-offset, fixed frame with respect to the
   M2020_LOCAL_LEVEL frame.

   \begindata

      FRAME_M2020_SURFACE_FIXED        = -168920
      FRAME_-168920_NAME               = 'M2020_SURFACE_FIXED'
      FRAME_-168920_CLASS              = 4
      FRAME_-168920_CLASS_ID           = -168920
      FRAME_-168920_CENTER             = -168900
      TKFRAME_-168920_RELATIVE         = 'M2020_LOCAL_LEVEL'
      TKFRAME_-168920_SPEC             = 'ANGLES'
      TKFRAME_-168920_UNITS            = 'DEGREES'
      TKFRAME_-168920_AXES             = (   1,       2,       3     )
      TKFRAME_-168920_ANGLES           = (   0.000,   0.000,   0.000 )

   \begintext


M2020 Rover Frames
========================================================================

   The M2020 rover NAV frame, M2020_ROVER, is defined as follows:

      -  +X points to the front of the rover, away from RTG
 
      -  +Z points down
 
      -  +Y completes the right handed frame
 
      -  the origin on this frame is between the rover middle wheels
         (midpoint between and on the rotation axis of the middle
         wheels for deployed rover and suspension system on flat plane.

   The M2020 rover NAV frame is shown on these diagrams:

      Rover -Y side view:
      -------------------
                               _
                              | | RSM
                              `-'
                               |              HGA
                               |          .```.         .
                               |         |  o  ---   .-' \ RTG
          RA                   |          `._.' | .-'     \
      -|-                  |-.-------------------'       .- 
       o---------o--------o| |                   |    .-' 
                             |.-------o----.     |-.-'
                           .-`--------------`-.--' 
                           |             .-----`o------.
                         .-|-.         .-|-.         .-|-.
                        |  o  |       |  o  |       |  o  |
                         `._.'   <-------x.'         `._.'
                                Xr       |
                                         |
                                         |
                                      Zr v     Yr is into the page.


      Rover -Z side ("top") view:
      ---------------------------

                        .-----.       .-----.       .-----.
                        |     |       |     |       |     |
                        |     |       |             |     |
                        `--|--'       `-- Yr        `--|--'
                           `----------o- ^ -----o------'
                             ..-.------- | ------.
                         RSM || |        |       |--------.
                             || |        |       |-------.|
          RA                 |`- <-------x       |       || RTG 
       |                     |  Xr           HGA |-------'|
      -o---------|--------|o-|            =====-o---------'
       |                     `-------------------' 
                           .----------o---------o------.
                        .--|--.       .--|--.       .--|--.
                        |     |       |     |       |     |
                        |     |       |     |       |     |
                        `-----'       `-----'       `-----'

                                               Zr is into the page.


   The orientation of this frame relative to other frames (J2000,
   M2020_LOCAL_LEVEL) changes in time and is provided in CK files.
   Therefore the M2020_ROVER frame is defined as a CK-based frame.

   \begindata

      FRAME_M2020_ROVER                = -168000
      FRAME_-168000_NAME               = 'M2020_ROVER'
      FRAME_-168000_CLASS              = 3
      FRAME_-168000_CLASS_ID           = -168000
      FRAME_-168000_CENTER             = -168
      CK_-168000_SCLK                  = -168
      CK_-168000_SPK                   = -168

   \begintext

   The M2020 rover mechanical frame -- M2020_ROVER_MECH -- is nominally
   co-aligned in orientation with the rover NAV frame, M2020_ROVER. The
   origin of this frame is different from the rover NAV frame origin
   and is translated from it by a fixed offset along the Z axis,
   provided in the M2020 structures SPK file.

   The M2020 rover and rover mechanical frames are shown on this diagram:

                               _
                              | | RSM
                              `-'
                               |              HGA
                               |          .```.         .
                               |         |  o  ---   .-' \ RTG
          RA                   |          `._.' | .-'     \
      -|-                  |-.-- <-------x ------'       .- 
       o---------o--------o| |  Xrm      |       |    .-' 
                             |.-------o- | .     |-.-'
                           .-`---------- | -`-.--' 
                           |         Zrm v ----`o------.
                         .-|-.         .- -.         .-|-.
                        |  o  |       |  o  |       |  o  |
                         `._.'   <-------x.'         `._.'
                                Xr       |
                                         |
                                         |
                                      Zr v     Yr, Yrm are into the page.


   The M2020_ROVER_MECH frame is defined below as fixed, zero-offset
   frame relative to the M2020_ROVER frame.
 
   \begindata

      FRAME_M2020_ROVER_MECH           = -168040
      FRAME_-168040_NAME               = 'M2020_ROVER_MECH'
      FRAME_-168040_CLASS              = 4
      FRAME_-168040_CLASS_ID           = -168040
      FRAME_-168040_CENTER             = -168
      TKFRAME_-168040_RELATIVE         = 'M2020_ROVER'
      TKFRAME_-168040_SPEC             = 'ANGLES'
      TKFRAME_-168040_UNITS            = 'DEGREES'
      TKFRAME_-168040_AXES             = (   1,       2,       3     )
      TKFRAME_-168040_ANGLES           = (   0.000,   0.000,   0.000 )

   \begintext


M2020 Cruise and Descent Frames
========================================================================

   The following three M2020 cruise and descent frames --
   M2020_SPACECRAFT, M2020_CRUISE_STAGE, and M2020_DESCENT_STAGE -- are
   nominally co-aligned in orientation with the rover NAV frame,
   M2020_ROVER. The origins of these frames are different from the
   rover NAV frame origin and are translated from it fixed offsets
   along the Z axis, provided in the M2020 structures SPK file.
 
   These frames are defined below as fixed, zero-offset frames relative
   to the M2020_ROVER frame.

   \begindata

      FRAME_M2020_SPACECRAFT           = -168010
      FRAME_-168010_NAME               = 'M2020_SPACECRAFT'
      FRAME_-168010_CLASS              = 4
      FRAME_-168010_CLASS_ID           = -168010
      FRAME_-168010_CENTER             = -168
      TKFRAME_-168010_RELATIVE         = 'M2020_ROVER'
      TKFRAME_-168010_SPEC             = 'ANGLES'
      TKFRAME_-168010_UNITS            = 'DEGREES'
      TKFRAME_-168010_AXES             = (   1,       2,       3     )
      TKFRAME_-168010_ANGLES           = (   0.000,   0.000,   0.000 )

      FRAME_M2020_CRUISE_STAGE         = -168020
      FRAME_-168020_NAME               = 'M2020_CRUISE_STAGE'
      FRAME_-168020_CLASS              = 4
      FRAME_-168020_CLASS_ID           = -168020
      FRAME_-168020_CENTER             = -168
      TKFRAME_-168020_RELATIVE         = 'M2020_ROVER'
      TKFRAME_-168020_SPEC             = 'ANGLES'
      TKFRAME_-168020_UNITS            = 'DEGREES'
      TKFRAME_-168020_AXES             = (   1,       2,       3     )
      TKFRAME_-168020_ANGLES           = (   0.000,   0.000,   0.000 )

      FRAME_M2020_DESCENT_STAGE        = -168030
      FRAME_-168030_NAME               = 'M2020_DESCENT_STAGE'
      FRAME_-168030_CLASS              = 4
      FRAME_-168030_CLASS_ID           = -168030
      FRAME_-168030_CENTER             = -168
      TKFRAME_-168030_RELATIVE         = 'M2020_ROVER'
      TKFRAME_-168030_SPEC             = 'ANGLES'
      TKFRAME_-168030_UNITS            = 'DEGREES'
      TKFRAME_-168030_AXES             = (   1,       2,       3     )
      TKFRAME_-168030_ANGLES           = (   0.000,   0.000,   0.000 )

   \begintext

   The M2020 Cruise ACS frame, M2020_CACS, is defined as follows:

      -  +Z is co-aligned with the +Z axis of the M2020_ROVER frame
 
      -  +Y is directly over the location of the cruise stage star
         scanner
 
      -  +X completes the right handed frame and is directly over the
         B-string thruster cluster
 
      -  the origin on this frame is the same as of the
         M2020_SPACECRAFT frame.

   Nominally this frame is rotated -135 degrees about +Z from the
   M2020_ROVER frame.
 
   The relation ship between M2020 rover and CACS frames is shown on
   this diagram:

                              Xcacs
                            ^
                             \         .> Ycacs 
                              \     .-' 
                               \ .-'
                                x-------> Xr
                                |
                                |
                                |
                                v
                                 Yr       Zr, Zcacs are into the page.


   Because during cruise the orientation of this frame relative the
   J2000 frame comes in telemetry and is provided in CK files, this
   frame is defined as a CK-based frame.

   \begindata

      FRAME_M2020_CACS                 = -168050
      FRAME_-168050_NAME               = 'M2020_CACS'
      FRAME_-168050_CLASS              = 3
      FRAME_-168050_CLASS_ID           = -168050
      FRAME_-168050_CENTER             = -168
      CK_-168050_SCLK                  = -168
      CK_-168050_SPK                   = -168

   \begintext


M2020 Antenna Frames
========================================================================

   This section defines frames for the M2020 antennas -- Cruise X-band
   Parachute Cone Low Gain Antenna (PLGA), Cruise X-band Tilted Low
   Gain Antenna (TLGA), Cruise Parachute Cone UHF Antenna (PUHF),
   Cruise Medium Gain Antenna (CMGA), X-band Descent Stage Low Gain
   Antenna (DLGA), Descent Stage UHF Antenna (DUHF), X-band Rover Low
   Gain Antenna (RLGA), and Rover UHF Antenna (RUHF).


Cruise Antennas
-------------------------------------------------

   The frames for antennas mounted on the M2020 cruise stage and
   parachute capsule -- M2020_PLGA, M2020_TLGA, M2020_PUHF, M2020_CMGA
   -- are fixed with respect to the cruise stage frame,
   M2020_CRUISE_STAGE, and defined as follows:

      -  +Z is the antenna boresight, which is nominally along the
         cruise stage -Z except for TLGA
 
      -  +X is nominally co-aligned with the the cruise stage +X,
         except for TLGA
 
      -  +Y completes the right handed frame
 
      -  the origin is at the center of the antenna side farthest from
         the mounting plate (rim, tip, etc).

   The M2020_PLGA, M2020_PUHF, and M2020_CMGA frames are rotated by 180
   degrees about +X from the M2020_CRUISE_STAGE frame.

   The M2020_TLGA frame is first rotated by 180 degrees about +X, then
   by -17.5 degrees about +Y from the M2020_CRUISE_STAGE frame.
 
   These frames are defined below as fixed frames relative to the
   M2020_CRUISE_STAGE frame.

   \begindata

      FRAME_M2020_PLGA                 = -168060
      FRAME_-168060_NAME               = 'M2020_PLGA'
      FRAME_-168060_CLASS              = 4
      FRAME_-168060_CLASS_ID           = -168060
      FRAME_-168060_CENTER             = -168
      TKFRAME_-168060_RELATIVE         = 'M2020_CRUISE_STAGE'
      TKFRAME_-168060_SPEC             = 'ANGLES'
      TKFRAME_-168060_UNITS            = 'DEGREES'
      TKFRAME_-168060_AXES             = (   1,       2,       3     )
      TKFRAME_-168060_ANGLES           = ( 180.000,   0.000,   0.000 )

      FRAME_M2020_TLGA                 = -168061
      FRAME_-168061_NAME               = 'M2020_TLGA'
      FRAME_-168061_CLASS              = 4
      FRAME_-168061_CLASS_ID           = -168061
      FRAME_-168061_CENTER             = -168
      TKFRAME_-168061_RELATIVE         = 'M2020_CRUISE_STAGE'
      TKFRAME_-168061_SPEC             = 'ANGLES'
      TKFRAME_-168061_UNITS            = 'DEGREES'
      TKFRAME_-168061_AXES             = (   1,       2,       3     )
      TKFRAME_-168061_ANGLES           = ( 180.000,  17.500,   0.000 )

      FRAME_M2020_PUHF                 = -168062
      FRAME_-168062_NAME               = 'M2020_PUHF'
      FRAME_-168062_CLASS              = 4
      FRAME_-168062_CLASS_ID           = -168062
      FRAME_-168062_CENTER             = -168
      TKFRAME_-168062_RELATIVE         = 'M2020_CRUISE_STAGE'
      TKFRAME_-168062_SPEC             = 'ANGLES'
      TKFRAME_-168062_UNITS            = 'DEGREES'
      TKFRAME_-168062_AXES             = (   1,       2,       3     )
      TKFRAME_-168062_ANGLES           = ( 180.000,   0.000,   0.000 )

      FRAME_M2020_CMGA                 = -168063
      FRAME_-168063_NAME               = 'M2020_CMGA'
      FRAME_-168063_CLASS              = 4
      FRAME_-168063_CLASS_ID           = -168063
      FRAME_-168063_CENTER             = -168
      TKFRAME_-168063_RELATIVE         = 'M2020_CRUISE_STAGE'
      TKFRAME_-168063_SPEC             = 'ANGLES'
      TKFRAME_-168063_UNITS            = 'DEGREES'
      TKFRAME_-168063_AXES             = (   1,       2,       3     )
      TKFRAME_-168063_ANGLES           = ( 180.000,   0.000,   0.000 )

   \begintext


EDL Antennas
-------------------------------------------------

   The frames for the antennas mounted on the M2020 descent stage --
   M2020_DLGA, M2020_DUHF -- are fixed with respect to the descent
   stage frame, M2020_DESCENT_STAGE, and defined as follows:

      -  +Z is the antenna boresight, nominally along the descent stage
         -Z
 
      -  +X is nominally co-aligned with the the descent stage +X
 
      -  +Y completes the right handed frame
 
      -  the origin is at the center of the antenna side farthest from
         the mounting plate (rim, tip, etc).

   The M2020_DLGA and M2020_DUHF frames are rotated by 180 degrees
   about +X from the M2020_DESCENT_STAGE frame.
 
   These frames are defined below as fixed frames relative to the
   M2020_DESCENT_STAGE frame.

   \begindata

      FRAME_M2020_DLGA                 = -168064
      FRAME_-168064_NAME               = 'M2020_DLGA'
      FRAME_-168064_CLASS              = 4
      FRAME_-168064_CLASS_ID           = -168064
      FRAME_-168064_CENTER             = -168
      TKFRAME_-168064_RELATIVE         = 'M2020_DESCENT_STAGE'
      TKFRAME_-168064_SPEC             = 'ANGLES'
      TKFRAME_-168064_UNITS            = 'DEGREES'
      TKFRAME_-168064_AXES             = (   1,       2,       3     )
      TKFRAME_-168064_ANGLES           = ( 180.000,   0.000,   0.000 )

      FRAME_M2020_DUHF                 = -168065
      FRAME_-168065_NAME               = 'M2020_DUHF'
      FRAME_-168065_CLASS              = 4
      FRAME_-168065_CLASS_ID           = -168065
      FRAME_-168065_CENTER             = -168
      TKFRAME_-168065_RELATIVE         = 'M2020_DESCENT_STAGE'
      TKFRAME_-168065_SPEC             = 'ANGLES'
      TKFRAME_-168065_UNITS            = 'DEGREES'
      TKFRAME_-168065_AXES             = (   1,       2,       3     )
      TKFRAME_-168065_ANGLES           = ( 180.000,   0.000,   0.000 )

   \begintext


Rover Antennas
-------------------------------------------------

   The frames for the two M2020 non-articulating antennas mounted on
   the rover body -- M2020_RLGA, M2020_RUHF -- are fixed with respect
   to the rover frame, M2020_ROVER, and defined as follows:

      -  +Z is the antenna boresight, nominally along the rover -Z
 
      -  +X is nominally co-aligned with the the rover +X
 
      -  +Y completes the right handed frame
 
      -  the origin is at the center of the antenna side farthest from
         the mounting plate (rim, tip, etc).

   The M2020_RLGA and M2020_RUHF frames are rotated by 180 degrees
   about +X from the M2020_ROVER frame.
 
   These frames are defined below as fixed frames relative to the
   M2020_ROVER frame.

   \begindata

      FRAME_M2020_RLGA                 = -168110
      FRAME_-168110_NAME               = 'M2020_RLGA'
      FRAME_-168110_CLASS              = 4
      FRAME_-168110_CLASS_ID           = -168110
      FRAME_-168110_CENTER             = -168
      TKFRAME_-168110_RELATIVE         = 'M2020_ROVER'
      TKFRAME_-168110_SPEC             = 'ANGLES'
      TKFRAME_-168110_UNITS            = 'DEGREES'
      TKFRAME_-168110_AXES             = (   1,       2,       3     )
      TKFRAME_-168110_ANGLES           = ( 180.000,   0.000,   0.000 )

      FRAME_M2020_RUHF                 = -168111
      FRAME_-168111_NAME               = 'M2020_RUHF'
      FRAME_-168111_CLASS              = 4
      FRAME_-168111_CLASS_ID           = -168111
      FRAME_-168111_CENTER             = -168
      TKFRAME_-168111_RELATIVE         = 'M2020_ROVER'
      TKFRAME_-168111_SPEC             = 'ANGLES'
      TKFRAME_-168111_UNITS            = 'DEGREES'
      TKFRAME_-168111_AXES             = (   1,       2,       3     )
      TKFRAME_-168111_ANGLES           = ( 180.000,   0.000,   0.000 )

   \begintext


M2020 NAIF ID Codes -- Definition Section
========================================================================

   This section contains name to NAIF ID mappings for the M2020.

   \begindata

      NAIF_BODY_NAME += ( 'M2020_LANDING_SITE'               )
      NAIF_BODY_CODE += ( -168900                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020'                            )
      NAIF_BODY_CODE += ( -168                               )
                                                            
      NAIF_BODY_NAME += ( 'M2020_ROVER'                      )
      NAIF_BODY_CODE += ( -168000                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_SPACECRAFT'                 )
      NAIF_BODY_CODE += ( -168010                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_CRUISE_STAGE'               )
      NAIF_BODY_CODE += ( -168020                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_DESCENT_STAGE'              )
      NAIF_BODY_CODE += ( -168030                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_ROVER_MECH'                 )
      NAIF_BODY_CODE += ( -168040                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_CACS'                       )
      NAIF_BODY_CODE += ( -168050                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_PLGA'                       )
      NAIF_BODY_CODE += ( -168060                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_TLGA'                       )
      NAIF_BODY_CODE += ( -168061                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_PUHF'                       )
      NAIF_BODY_CODE += ( -168062                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_CMGA'                       )
      NAIF_BODY_CODE += ( -168063                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_DLGA'                       )
      NAIF_BODY_CODE += ( -168064                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_DUHF'                       )
      NAIF_BODY_CODE += ( -168065                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_RLGA'                       )
      NAIF_BODY_CODE += ( -168110                            )
                                                            
      NAIF_BODY_NAME += ( 'M2020_RUHF'                       )
      NAIF_BODY_CODE += ( -168111                            )
                                                            
   \begintext

   M2020 site name to NAIF ID mappings.

   \begindata
                                                            
      NAIF_BODY_NAME += ( 'M2020_SITE_1'                     )
      NAIF_BODY_CODE += ( -168501                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_2'                     )
      NAIF_BODY_CODE += ( -168502                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_3'                     )
      NAIF_BODY_CODE += ( -168503                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_4'                     )
      NAIF_BODY_CODE += ( -168504                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_5'                     )
      NAIF_BODY_CODE += ( -168505                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_6'                     )
      NAIF_BODY_CODE += ( -168506                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_7'                     )
      NAIF_BODY_CODE += ( -168507                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_8'                     )
      NAIF_BODY_CODE += ( -168508                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_9'                     )
      NAIF_BODY_CODE += ( -168509                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_10'                    )
      NAIF_BODY_CODE += ( -168510                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_11'                    )
      NAIF_BODY_CODE += ( -168511                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_12'                    )
      NAIF_BODY_CODE += ( -168512                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_13'                    )
      NAIF_BODY_CODE += ( -168513                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_14'                    )
      NAIF_BODY_CODE += ( -168514                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_15'                    )
      NAIF_BODY_CODE += ( -168515                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_16'                    )
      NAIF_BODY_CODE += ( -168516                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_17'                    )
      NAIF_BODY_CODE += ( -168517                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_18'                    )
      NAIF_BODY_CODE += ( -168518                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_19'                    )
      NAIF_BODY_CODE += ( -168519                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_20'                    )
      NAIF_BODY_CODE += ( -168520                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_21'                    )
      NAIF_BODY_CODE += ( -168521                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_22'                    )
      NAIF_BODY_CODE += ( -168522                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_23'                    )
      NAIF_BODY_CODE += ( -168523                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_24'                    )
      NAIF_BODY_CODE += ( -168524                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_25'                    )
      NAIF_BODY_CODE += ( -168525                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_26'                    )
      NAIF_BODY_CODE += ( -168526                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_27'                    )
      NAIF_BODY_CODE += ( -168527                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_28'                    )
      NAIF_BODY_CODE += ( -168528                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_29'                    )
      NAIF_BODY_CODE += ( -168529                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_30'                    )
      NAIF_BODY_CODE += ( -168530                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_31'                    )
      NAIF_BODY_CODE += ( -168531                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_32'                    )
      NAIF_BODY_CODE += ( -168532                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_33'                    )
      NAIF_BODY_CODE += ( -168533                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_34'                    )
      NAIF_BODY_CODE += ( -168534                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_35'                    )
      NAIF_BODY_CODE += ( -168535                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_36'                    )
      NAIF_BODY_CODE += ( -168536                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_37'                    )
      NAIF_BODY_CODE += ( -168537                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_38'                    )
      NAIF_BODY_CODE += ( -168538                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_39'                    )
      NAIF_BODY_CODE += ( -168539                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_40'                    )
      NAIF_BODY_CODE += ( -168540                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_41'                    )
      NAIF_BODY_CODE += ( -168541                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_42'                    )
      NAIF_BODY_CODE += ( -168542                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_43'                    )
      NAIF_BODY_CODE += ( -168543                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_44'                    )
      NAIF_BODY_CODE += ( -168544                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_45'                    )
      NAIF_BODY_CODE += ( -168545                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_46'                    )
      NAIF_BODY_CODE += ( -168546                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_47'                    )
      NAIF_BODY_CODE += ( -168547                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_48'                    )
      NAIF_BODY_CODE += ( -168548                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_49'                    )
      NAIF_BODY_CODE += ( -168549                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_50'                    )
      NAIF_BODY_CODE += ( -168550                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_51'                    )
      NAIF_BODY_CODE += ( -168551                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_52'                    )
      NAIF_BODY_CODE += ( -168552                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_53'                    )
      NAIF_BODY_CODE += ( -168553                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_54'                    )
      NAIF_BODY_CODE += ( -168554                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_55'                    )
      NAIF_BODY_CODE += ( -168555                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_56'                    )
      NAIF_BODY_CODE += ( -168556                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_57'                    )
      NAIF_BODY_CODE += ( -168557                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_58'                    )
      NAIF_BODY_CODE += ( -168558                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_59'                    )
      NAIF_BODY_CODE += ( -168559                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_60'                    )
      NAIF_BODY_CODE += ( -168560                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_61'                    )
      NAIF_BODY_CODE += ( -168561                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_62'                    )
      NAIF_BODY_CODE += ( -168562                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_63'                    )
      NAIF_BODY_CODE += ( -168563                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_64'                    )
      NAIF_BODY_CODE += ( -168564                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_65'                    )
      NAIF_BODY_CODE += ( -168565                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_66'                    )
      NAIF_BODY_CODE += ( -168566                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_67'                    )
      NAIF_BODY_CODE += ( -168567                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_68'                    )
      NAIF_BODY_CODE += ( -168568                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_69'                    )
      NAIF_BODY_CODE += ( -168569                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_70'                    )
      NAIF_BODY_CODE += ( -168570                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_71'                    )
      NAIF_BODY_CODE += ( -168571                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_72'                    )
      NAIF_BODY_CODE += ( -168572                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_73'                    )
      NAIF_BODY_CODE += ( -168573                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_74'                    )
      NAIF_BODY_CODE += ( -168574                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_75'                    )
      NAIF_BODY_CODE += ( -168575                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_76'                    )
      NAIF_BODY_CODE += ( -168576                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_77'                    )
      NAIF_BODY_CODE += ( -168577                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_78'                    )
      NAIF_BODY_CODE += ( -168578                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_79'                    )
      NAIF_BODY_CODE += ( -168579                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_80'                    )
      NAIF_BODY_CODE += ( -168580                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_81'                    )
      NAIF_BODY_CODE += ( -168581                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_82'                    )
      NAIF_BODY_CODE += ( -168582                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_83'                    )
      NAIF_BODY_CODE += ( -168583                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_84'                    )
      NAIF_BODY_CODE += ( -168584                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_85'                    )
      NAIF_BODY_CODE += ( -168585                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_86'                    )
      NAIF_BODY_CODE += ( -168586                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_87'                    )
      NAIF_BODY_CODE += ( -168587                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_88'                    )
      NAIF_BODY_CODE += ( -168588                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_89'                    )
      NAIF_BODY_CODE += ( -168589                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_90'                    )
      NAIF_BODY_CODE += ( -168590                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_91'                    )
      NAIF_BODY_CODE += ( -168591                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_92'                    )
      NAIF_BODY_CODE += ( -168592                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_93'                    )
      NAIF_BODY_CODE += ( -168593                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_94'                    )
      NAIF_BODY_CODE += ( -168594                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_95'                    )
      NAIF_BODY_CODE += ( -168595                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_96'                    )
      NAIF_BODY_CODE += ( -168596                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_97'                    )
      NAIF_BODY_CODE += ( -168597                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_98'                    )
      NAIF_BODY_CODE += ( -168598                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_99'                    )
      NAIF_BODY_CODE += ( -168599                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_100'                   )
      NAIF_BODY_CODE += ( -168600                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_101'                   )
      NAIF_BODY_CODE += ( -168601                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_102'                   )
      NAIF_BODY_CODE += ( -168602                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_103'                   )
      NAIF_BODY_CODE += ( -168603                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_104'                   )
      NAIF_BODY_CODE += ( -168604                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_105'                   )
      NAIF_BODY_CODE += ( -168605                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_106'                   )
      NAIF_BODY_CODE += ( -168606                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_107'                   )
      NAIF_BODY_CODE += ( -168607                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_108'                   )
      NAIF_BODY_CODE += ( -168608                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_109'                   )
      NAIF_BODY_CODE += ( -168609                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_110'                   )
      NAIF_BODY_CODE += ( -168610                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_111'                   )
      NAIF_BODY_CODE += ( -168611                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_112'                   )
      NAIF_BODY_CODE += ( -168612                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_113'                   )
      NAIF_BODY_CODE += ( -168613                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_114'                   )
      NAIF_BODY_CODE += ( -168614                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_115'                   )
      NAIF_BODY_CODE += ( -168615                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_116'                   )
      NAIF_BODY_CODE += ( -168616                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_117'                   )
      NAIF_BODY_CODE += ( -168617                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_118'                   )
      NAIF_BODY_CODE += ( -168618                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_119'                   )
      NAIF_BODY_CODE += ( -168619                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_120'                   )
      NAIF_BODY_CODE += ( -168620                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_121'                   )
      NAIF_BODY_CODE += ( -168621                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_122'                   )
      NAIF_BODY_CODE += ( -168622                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_123'                   )
      NAIF_BODY_CODE += ( -168623                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_124'                   )
      NAIF_BODY_CODE += ( -168624                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_125'                   )
      NAIF_BODY_CODE += ( -168625                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_126'                   )
      NAIF_BODY_CODE += ( -168626                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_127'                   )
      NAIF_BODY_CODE += ( -168627                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_128'                   )
      NAIF_BODY_CODE += ( -168628                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_129'                   )
      NAIF_BODY_CODE += ( -168629                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_130'                   )
      NAIF_BODY_CODE += ( -168630                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_131'                   )
      NAIF_BODY_CODE += ( -168631                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_132'                   )
      NAIF_BODY_CODE += ( -168632                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_133'                   )
      NAIF_BODY_CODE += ( -168633                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_134'                   )
      NAIF_BODY_CODE += ( -168634                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_135'                   )
      NAIF_BODY_CODE += ( -168635                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_136'                   )
      NAIF_BODY_CODE += ( -168636                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_137'                   )
      NAIF_BODY_CODE += ( -168637                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_138'                   )
      NAIF_BODY_CODE += ( -168638                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_139'                   )
      NAIF_BODY_CODE += ( -168639                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_140'                   )
      NAIF_BODY_CODE += ( -168640                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_141'                   )
      NAIF_BODY_CODE += ( -168641                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_142'                   )
      NAIF_BODY_CODE += ( -168642                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_143'                   )
      NAIF_BODY_CODE += ( -168643                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_144'                   )
      NAIF_BODY_CODE += ( -168644                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_145'                   )
      NAIF_BODY_CODE += ( -168645                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_146'                   )
      NAIF_BODY_CODE += ( -168646                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_147'                   )
      NAIF_BODY_CODE += ( -168647                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_148'                   )
      NAIF_BODY_CODE += ( -168648                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_149'                   )
      NAIF_BODY_CODE += ( -168649                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_150'                   )
      NAIF_BODY_CODE += ( -168650                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_151'                   )
      NAIF_BODY_CODE += ( -168651                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_152'                   )
      NAIF_BODY_CODE += ( -168652                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_153'                   )
      NAIF_BODY_CODE += ( -168653                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_154'                   )
      NAIF_BODY_CODE += ( -168654                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_155'                   )
      NAIF_BODY_CODE += ( -168655                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_156'                   )
      NAIF_BODY_CODE += ( -168656                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_157'                   )
      NAIF_BODY_CODE += ( -168657                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_158'                   )
      NAIF_BODY_CODE += ( -168658                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_159'                   )
      NAIF_BODY_CODE += ( -168659                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_160'                   )
      NAIF_BODY_CODE += ( -168660                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_161'                   )
      NAIF_BODY_CODE += ( -168661                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_162'                   )
      NAIF_BODY_CODE += ( -168662                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_163'                   )
      NAIF_BODY_CODE += ( -168663                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_164'                   )
      NAIF_BODY_CODE += ( -168664                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_165'                   )
      NAIF_BODY_CODE += ( -168665                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_166'                   )
      NAIF_BODY_CODE += ( -168666                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_167'                   )
      NAIF_BODY_CODE += ( -168667                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_168'                   )
      NAIF_BODY_CODE += ( -168668                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_169'                   )
      NAIF_BODY_CODE += ( -168669                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_170'                   )
      NAIF_BODY_CODE += ( -168670                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_171'                   )
      NAIF_BODY_CODE += ( -168671                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_172'                   )
      NAIF_BODY_CODE += ( -168672                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_173'                   )
      NAIF_BODY_CODE += ( -168673                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_174'                   )
      NAIF_BODY_CODE += ( -168674                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_175'                   )
      NAIF_BODY_CODE += ( -168675                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_176'                   )
      NAIF_BODY_CODE += ( -168676                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_177'                   )
      NAIF_BODY_CODE += ( -168677                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_178'                   )
      NAIF_BODY_CODE += ( -168678                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_179'                   )
      NAIF_BODY_CODE += ( -168679                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_180'                   )
      NAIF_BODY_CODE += ( -168680                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_181'                   )
      NAIF_BODY_CODE += ( -168681                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_182'                   )
      NAIF_BODY_CODE += ( -168682                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_183'                   )
      NAIF_BODY_CODE += ( -168683                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_184'                   )
      NAIF_BODY_CODE += ( -168684                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_185'                   )
      NAIF_BODY_CODE += ( -168685                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_186'                   )
      NAIF_BODY_CODE += ( -168686                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_187'                   )
      NAIF_BODY_CODE += ( -168687                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_188'                   )
      NAIF_BODY_CODE += ( -168688                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_189'                   )
      NAIF_BODY_CODE += ( -168689                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_190'                   )
      NAIF_BODY_CODE += ( -168690                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_191'                   )
      NAIF_BODY_CODE += ( -168691                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_192'                   )
      NAIF_BODY_CODE += ( -168692                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_193'                   )
      NAIF_BODY_CODE += ( -168693                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_194'                   )
      NAIF_BODY_CODE += ( -168694                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_195'                   )
      NAIF_BODY_CODE += ( -168695                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_196'                   )
      NAIF_BODY_CODE += ( -168696                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_197'                   )
      NAIF_BODY_CODE += ( -168697                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_198'                   )
      NAIF_BODY_CODE += ( -168698                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_199'                   )
      NAIF_BODY_CODE += ( -168699                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_200'                   )
      NAIF_BODY_CODE += ( -168700                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_201'                   )
      NAIF_BODY_CODE += ( -168701                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_202'                   )
      NAIF_BODY_CODE += ( -168702                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_203'                   )
      NAIF_BODY_CODE += ( -168703                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_204'                   )
      NAIF_BODY_CODE += ( -168704                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_205'                   )
      NAIF_BODY_CODE += ( -168705                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_206'                   )
      NAIF_BODY_CODE += ( -168706                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_207'                   )
      NAIF_BODY_CODE += ( -168707                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_208'                   )
      NAIF_BODY_CODE += ( -168708                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_209'                   )
      NAIF_BODY_CODE += ( -168709                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_210'                   )
      NAIF_BODY_CODE += ( -168710                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_211'                   )
      NAIF_BODY_CODE += ( -168711                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_212'                   )
      NAIF_BODY_CODE += ( -168712                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_213'                   )
      NAIF_BODY_CODE += ( -168713                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_214'                   )
      NAIF_BODY_CODE += ( -168714                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_215'                   )
      NAIF_BODY_CODE += ( -168715                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_216'                   )
      NAIF_BODY_CODE += ( -168716                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_217'                   )
      NAIF_BODY_CODE += ( -168717                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_218'                   )
      NAIF_BODY_CODE += ( -168718                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_219'                   )
      NAIF_BODY_CODE += ( -168719                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_220'                   )
      NAIF_BODY_CODE += ( -168720                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_221'                   )
      NAIF_BODY_CODE += ( -168721                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_222'                   )
      NAIF_BODY_CODE += ( -168722                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_223'                   )
      NAIF_BODY_CODE += ( -168723                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_224'                   )
      NAIF_BODY_CODE += ( -168724                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_225'                   )
      NAIF_BODY_CODE += ( -168725                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_226'                   )
      NAIF_BODY_CODE += ( -168726                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_227'                   )
      NAIF_BODY_CODE += ( -168727                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_228'                   )
      NAIF_BODY_CODE += ( -168728                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_229'                   )
      NAIF_BODY_CODE += ( -168729                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_230'                   )
      NAIF_BODY_CODE += ( -168730                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_231'                   )
      NAIF_BODY_CODE += ( -168731                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_232'                   )
      NAIF_BODY_CODE += ( -168732                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_233'                   )
      NAIF_BODY_CODE += ( -168733                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_234'                   )
      NAIF_BODY_CODE += ( -168734                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_235'                   )
      NAIF_BODY_CODE += ( -168735                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_236'                   )
      NAIF_BODY_CODE += ( -168736                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_237'                   )
      NAIF_BODY_CODE += ( -168737                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_238'                   )
      NAIF_BODY_CODE += ( -168738                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_239'                   )
      NAIF_BODY_CODE += ( -168739                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_240'                   )
      NAIF_BODY_CODE += ( -168740                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_241'                   )
      NAIF_BODY_CODE += ( -168741                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_242'                   )
      NAIF_BODY_CODE += ( -168742                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_243'                   )
      NAIF_BODY_CODE += ( -168743                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_244'                   )
      NAIF_BODY_CODE += ( -168744                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_245'                   )
      NAIF_BODY_CODE += ( -168745                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_246'                   )
      NAIF_BODY_CODE += ( -168746                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_247'                   )
      NAIF_BODY_CODE += ( -168747                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_248'                   )
      NAIF_BODY_CODE += ( -168748                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_249'                   )
      NAIF_BODY_CODE += ( -168749                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_250'                   )
      NAIF_BODY_CODE += ( -168750                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_251'                   )
      NAIF_BODY_CODE += ( -168751                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_252'                   )
      NAIF_BODY_CODE += ( -168752                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_253'                   )
      NAIF_BODY_CODE += ( -168753                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_254'                   )
      NAIF_BODY_CODE += ( -168754                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_255'                   )
      NAIF_BODY_CODE += ( -168755                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_256'                   )
      NAIF_BODY_CODE += ( -168756                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_257'                   )
      NAIF_BODY_CODE += ( -168757                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_258'                   )
      NAIF_BODY_CODE += ( -168758                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_259'                   )
      NAIF_BODY_CODE += ( -168759                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_260'                   )
      NAIF_BODY_CODE += ( -168760                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_261'                   )
      NAIF_BODY_CODE += ( -168761                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_262'                   )
      NAIF_BODY_CODE += ( -168762                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_263'                   )
      NAIF_BODY_CODE += ( -168763                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_264'                   )
      NAIF_BODY_CODE += ( -168764                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_265'                   )
      NAIF_BODY_CODE += ( -168765                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_266'                   )
      NAIF_BODY_CODE += ( -168766                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_267'                   )
      NAIF_BODY_CODE += ( -168767                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_268'                   )
      NAIF_BODY_CODE += ( -168768                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_269'                   )
      NAIF_BODY_CODE += ( -168769                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_270'                   )
      NAIF_BODY_CODE += ( -168770                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_271'                   )
      NAIF_BODY_CODE += ( -168771                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_272'                   )
      NAIF_BODY_CODE += ( -168772                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_273'                   )
      NAIF_BODY_CODE += ( -168773                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_274'                   )
      NAIF_BODY_CODE += ( -168774                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_275'                   )
      NAIF_BODY_CODE += ( -168775                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_276'                   )
      NAIF_BODY_CODE += ( -168776                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_277'                   )
      NAIF_BODY_CODE += ( -168777                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_278'                   )
      NAIF_BODY_CODE += ( -168778                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_279'                   )
      NAIF_BODY_CODE += ( -168779                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_280'                   )
      NAIF_BODY_CODE += ( -168780                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_281'                   )
      NAIF_BODY_CODE += ( -168781                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_282'                   )
      NAIF_BODY_CODE += ( -168782                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_283'                   )
      NAIF_BODY_CODE += ( -168783                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_284'                   )
      NAIF_BODY_CODE += ( -168784                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_285'                   )
      NAIF_BODY_CODE += ( -168785                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_286'                   )
      NAIF_BODY_CODE += ( -168786                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_287'                   )
      NAIF_BODY_CODE += ( -168787                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_288'                   )
      NAIF_BODY_CODE += ( -168788                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_289'                   )
      NAIF_BODY_CODE += ( -168789                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_290'                   )
      NAIF_BODY_CODE += ( -168790                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_291'                   )
      NAIF_BODY_CODE += ( -168791                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_292'                   )
      NAIF_BODY_CODE += ( -168792                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_293'                   )
      NAIF_BODY_CODE += ( -168793                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_294'                   )
      NAIF_BODY_CODE += ( -168794                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_295'                   )
      NAIF_BODY_CODE += ( -168795                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_296'                   )
      NAIF_BODY_CODE += ( -168796                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_297'                   )
      NAIF_BODY_CODE += ( -168797                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_298'                   )
      NAIF_BODY_CODE += ( -168798                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_299'                   )
      NAIF_BODY_CODE += ( -168799                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_300'                   )
      NAIF_BODY_CODE += ( -168800                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_301'                   )
      NAIF_BODY_CODE += ( -168801                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_302'                   )
      NAIF_BODY_CODE += ( -168802                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_303'                   )
      NAIF_BODY_CODE += ( -168803                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_304'                   )
      NAIF_BODY_CODE += ( -168804                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_305'                   )
      NAIF_BODY_CODE += ( -168805                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_306'                   )
      NAIF_BODY_CODE += ( -168806                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_307'                   )
      NAIF_BODY_CODE += ( -168807                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_308'                   )
      NAIF_BODY_CODE += ( -168808                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_309'                   )
      NAIF_BODY_CODE += ( -168809                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_310'                   )
      NAIF_BODY_CODE += ( -168810                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_311'                   )
      NAIF_BODY_CODE += ( -168811                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_312'                   )
      NAIF_BODY_CODE += ( -168812                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_313'                   )
      NAIF_BODY_CODE += ( -168813                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_314'                   )
      NAIF_BODY_CODE += ( -168814                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_315'                   )
      NAIF_BODY_CODE += ( -168815                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_316'                   )
      NAIF_BODY_CODE += ( -168816                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_317'                   )
      NAIF_BODY_CODE += ( -168817                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_318'                   )
      NAIF_BODY_CODE += ( -168818                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_319'                   )
      NAIF_BODY_CODE += ( -168819                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_320'                   )
      NAIF_BODY_CODE += ( -168820                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_321'                   )
      NAIF_BODY_CODE += ( -168821                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_322'                   )
      NAIF_BODY_CODE += ( -168822                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_323'                   )
      NAIF_BODY_CODE += ( -168823                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_324'                   )
      NAIF_BODY_CODE += ( -168824                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_325'                   )
      NAIF_BODY_CODE += ( -168825                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_326'                   )
      NAIF_BODY_CODE += ( -168826                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_327'                   )
      NAIF_BODY_CODE += ( -168827                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_328'                   )
      NAIF_BODY_CODE += ( -168828                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_329'                   )
      NAIF_BODY_CODE += ( -168829                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_330'                   )
      NAIF_BODY_CODE += ( -168830                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_331'                   )
      NAIF_BODY_CODE += ( -168831                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_332'                   )
      NAIF_BODY_CODE += ( -168832                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_333'                   )
      NAIF_BODY_CODE += ( -168833                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_334'                   )
      NAIF_BODY_CODE += ( -168834                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_335'                   )
      NAIF_BODY_CODE += ( -168835                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_336'                   )
      NAIF_BODY_CODE += ( -168836                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_337'                   )
      NAIF_BODY_CODE += ( -168837                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_338'                   )
      NAIF_BODY_CODE += ( -168838                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_339'                   )
      NAIF_BODY_CODE += ( -168839                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_340'                   )
      NAIF_BODY_CODE += ( -168840                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_341'                   )
      NAIF_BODY_CODE += ( -168841                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_342'                   )
      NAIF_BODY_CODE += ( -168842                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_343'                   )
      NAIF_BODY_CODE += ( -168843                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_344'                   )
      NAIF_BODY_CODE += ( -168844                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_345'                   )
      NAIF_BODY_CODE += ( -168845                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_346'                   )
      NAIF_BODY_CODE += ( -168846                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_347'                   )
      NAIF_BODY_CODE += ( -168847                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_348'                   )
      NAIF_BODY_CODE += ( -168848                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_349'                   )
      NAIF_BODY_CODE += ( -168849                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_350'                   )
      NAIF_BODY_CODE += ( -168850                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_351'                   )
      NAIF_BODY_CODE += ( -168851                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_352'                   )
      NAIF_BODY_CODE += ( -168852                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_353'                   )
      NAIF_BODY_CODE += ( -168853                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_354'                   )
      NAIF_BODY_CODE += ( -168854                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_355'                   )
      NAIF_BODY_CODE += ( -168855                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_356'                   )
      NAIF_BODY_CODE += ( -168856                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_357'                   )
      NAIF_BODY_CODE += ( -168857                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_358'                   )
      NAIF_BODY_CODE += ( -168858                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_359'                   )
      NAIF_BODY_CODE += ( -168859                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_360'                   )
      NAIF_BODY_CODE += ( -168860                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_361'                   )
      NAIF_BODY_CODE += ( -168861                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_362'                   )
      NAIF_BODY_CODE += ( -168862                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_363'                   )
      NAIF_BODY_CODE += ( -168863                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_364'                   )
      NAIF_BODY_CODE += ( -168864                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_365'                   )
      NAIF_BODY_CODE += ( -168865                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_366'                   )
      NAIF_BODY_CODE += ( -168866                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_367'                   )
      NAIF_BODY_CODE += ( -168867                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_368'                   )
      NAIF_BODY_CODE += ( -168868                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_369'                   )
      NAIF_BODY_CODE += ( -168869                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_370'                   )
      NAIF_BODY_CODE += ( -168870                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_371'                   )
      NAIF_BODY_CODE += ( -168871                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_372'                   )
      NAIF_BODY_CODE += ( -168872                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_373'                   )
      NAIF_BODY_CODE += ( -168873                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_374'                   )
      NAIF_BODY_CODE += ( -168874                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_375'                   )
      NAIF_BODY_CODE += ( -168875                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_376'                   )
      NAIF_BODY_CODE += ( -168876                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_377'                   )
      NAIF_BODY_CODE += ( -168877                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_378'                   )
      NAIF_BODY_CODE += ( -168878                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_379'                   )
      NAIF_BODY_CODE += ( -168879                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_380'                   )
      NAIF_BODY_CODE += ( -168880                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_381'                   )
      NAIF_BODY_CODE += ( -168881                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_382'                   )
      NAIF_BODY_CODE += ( -168882                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_383'                   )
      NAIF_BODY_CODE += ( -168883                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_384'                   )
      NAIF_BODY_CODE += ( -168884                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_385'                   )
      NAIF_BODY_CODE += ( -168885                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_386'                   )
      NAIF_BODY_CODE += ( -168886                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_387'                   )
      NAIF_BODY_CODE += ( -168887                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_388'                   )
      NAIF_BODY_CODE += ( -168888                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_389'                   )
      NAIF_BODY_CODE += ( -168889                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_390'                   )
      NAIF_BODY_CODE += ( -168890                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_391'                   )
      NAIF_BODY_CODE += ( -168891                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_392'                   )
      NAIF_BODY_CODE += ( -168892                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_393'                   )
      NAIF_BODY_CODE += ( -168893                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_394'                   )
      NAIF_BODY_CODE += ( -168894                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_395'                   )
      NAIF_BODY_CODE += ( -168895                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_396'                   )
      NAIF_BODY_CODE += ( -168896                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_397'                   )
      NAIF_BODY_CODE += ( -168897                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_398'                   )
      NAIF_BODY_CODE += ( -168898                            )

      NAIF_BODY_NAME += ( 'M2020_SITE_399'                   )
      NAIF_BODY_CODE += ( -168899                            )

   \begintext

End of FK file.
