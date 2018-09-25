const SSH = require('simple-ssh');
const fs = require('fs');

exports.echo = function (ssh, command) {
  return new Promise(((resolve, reject) => {
    let data = '';
    let error = null;

    ssh.exec(command, {
      out(stdout) {
        data += stdout;
      },
      exit(code) {
        if (code !== 0) {
          reject(new Error(`exit code: ${code}`));
          // return callback(new Error(`exit code: ${code}`));
        }
        // here's all the data you have persisted from stdout
        resolve(data);
      },
      error(err) {
        error = err;
        reject(new Error(`exit code: ${code}`));
      },
    })
      .start();
  }));
};
