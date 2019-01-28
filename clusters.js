var cluster = require('cluster'), cpus = require('os').cpus()

if (cluster.isMaster) {
  cpus.forEach((cpu) => {
    cluster.fork()
  })
  cluster.on('listening', (worker) => {
    console.log("Cluster %d conectado", worker.process.pid);
  })
  cluster.on('disconnect', (worker) => {
    console.log('Cluster %d esta desconectado.', worker.process.pid);
  })
  cluster.on('exit', (worker) =>{
    console.log('Cluster %d caiu fora.', worker.process.pid);
  })
} else {
  require('.')
}