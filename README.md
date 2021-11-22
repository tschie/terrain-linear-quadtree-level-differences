# Terrain using Linear Quadtree with Level Differences

This project demonstrates the use of a linear quadtree with level differences to fill in the seams between terrain tiles of different size/resolution. The quadtree's encoding allows resolutions of neighboring tiles to be looked up in constant time and used in the shader to interpolate vertex heights on tile edges in real-time.

![Camera flying out showing tiling](flyout.gif)

[Demo](https://tschie.github.io/terrain-linear-quadtree-level-differences/) (currently not suitable for mobile devices)

## Usage

Fly the camera using WASD. Click and drag to point camera. As you fly around, tiles will update their resolutions. 

Check the wireframe box to visualize the tiling. Uncheck to see that there are no seams between tiles.

## Run Locally

1. Clone the repository.
2. In the root directory, run `npm install`.
3. Run `npm run dev`.
4. Open browser to localhost:3000.

## Quadtree Implementation References

- http://www.lcad.icmc.usp.br/~jbatista/procimg/quadtree_neighbours.pdf
- https://github.com/dwrodri/LQTLD3/blob/master/quadtrees/trees.py
