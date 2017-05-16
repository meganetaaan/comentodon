const work = require('webworkify')

class MastodonTimeLine {
  constructor () {
    this.worker = work(require('./mastodonWorker.js'))
    this.list = document.createElement('div')
    document.querySelector('body').appendChild(this.list)
    this.worker.addEventListener('message', this.onMessage.bind(this))
    this.maxCount = 20
    this.lineHeight = 40
    this.width = document.querySelector('body').getBoundingClientRect().width
    this.onEnteringTable = []
  }

  onMessage (event) {
    const message = event.data
    if(message && message.data && message.data.content){
      const item = document.createElement('div')
      item.innerHTML = message.data.content.replace(/(<br>|<br \/>)/gi, '')
      this._allocateRow(item)
    }
  }

  _allocateRow (item) {
    for(let i = 0, len = this.maxCount; i < len; i++) {
      if(this.onEnteringTable[i] == null) {
        item.style.top = String(i * this.lineHeight) + 'px'
        item.classList.add('comment')
        item.addEventListener('animationend', (ev) => {
          item.parentNode.removeChild(item)
        })
        this.list.appendChild(item)
        const width = item.getBoundingClientRect().width
        const enteringDuration = width / (width * 1.0 + this.width) * 8000

        this.onEnteringTable[i] = item
        console.debug(enteringDuration)
        setTimeout(()=>{
          this.onEnteringTable[i] = null
        }, enteringDuration)
        return i
      }
    }
    console.debug('the table is full')
    return null
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const mastodonTimeline = new MastodonTimeLine()
})
