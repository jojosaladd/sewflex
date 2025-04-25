import { pctBasedOn } from '@freesewing/core'

function draftSquare({   
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
    let width = 30
    let height = 30

    // Define rectangle corners based on measurements
    points.topLeft = new Point(0, 0);
    points.bottomRight = new Point(width, height);
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

export const square = {
  name: 'teagan.square',
  draft: draftSquare
};
