const { InstanceBase, TCPHelper, runEntrypoint } = require('@companion-module/base')

class AvmatrixModule extends InstanceBase {
  async init(config) {
    this.config = config
    this.updateStatus('connecting')
    this.socket = new TCPHelper(config.host, parseInt(config.port))
    this.socket.on('status_change', (status) => this.updateStatus(status))
    this.socket.on('error', (err) => this.log('error', err.message))
    this.initActions()
  }

  initActions() {
    this.setActions({
      input1: {
        name: 'Set Input 1 as PGM',
        callback: () => {
          const cmd = Buffer.from([0x5A, 0x0A, 0x00, 0x00, 0x00, 0x11, 0x01, 0xDD])
          this.socket.send(cmd)
        }
      }
    })
  }

  getConfigFields() {
    return [
      { type: 'textinput', id: 'host', label: 'IP Address', default: '192.168.1.215' },
      { type: 'textinput', id: 'port', label: 'Port', default: '19523' },
    ]
  }

  async destroy() {
    if (this.socket) this.socket.destroy()
  }
}

runEntrypoint(AvmatrixModule)