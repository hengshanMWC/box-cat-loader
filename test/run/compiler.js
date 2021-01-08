import webpack from 'webpack';
import memoryfs from 'memory-fs';
export default options => {
  const compiler = webpack(options);

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      resolve(stats);
    });
  });
}