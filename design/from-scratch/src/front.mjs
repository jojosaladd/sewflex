import { pctBasedOn } from '@freesewing/core'

function draftFront({   
  Path,
  Point,
  paths,
  points,
  sa,
  measurements,
  options,
  part, 
}) {
    // console.log("measurement.width", measurements.width);
    // console.log("options.width", options.width);

    // Use options as percentage-based adjustments
    let chest = measurements.chest * (options.chest);
    let waist = measurements.waist * (options.waist);

    // Define rectangle corners based on measurements
    points.topLeft = new Point(0, 0);
    points.bottomRight = new Point(chest, waist);
    points.topRight = new Point(points.bottomRight.x, points.topLeft.y);
    points.bottomLeft = new Point(points.topLeft.x, points.bottomRight.y);

    // Draw the rectangle
    paths.shape = new Path()
      .move(points.topLeft)
      .line(points.bottomLeft)
      .line(points.bottomRight)
      .line(points.topRight)
      .close()
      .addClass('fabric');

    // Add seam allowance if applicable
    if (sa) paths.sa = paths.shape.offset(sa).addClass('fabric sa');

    return part;
}

export const front = {
  name: 'fromscratch.front',
  draft: draftFront,
  measurements: ['chest', 'waist'], // Standard FreeSewing measurements
  options: {
    chest: {
      pct: 100, // Default to 100% (same as measurement)
      min: 50, // Allow reduction down to 50%
      max: 150, // Allow increase up to 150%
      menu: 'fit',
      toAbs: (val, { measurements }) => measurements.chest * val
    },
    waist: {
      pct: 100, // Default to 100%
      min: 50, 
      max: 150, 
      menu: 'fit',
      toAbs: (val, { measurements }) => measurements.waist * val

    },
  },
};
