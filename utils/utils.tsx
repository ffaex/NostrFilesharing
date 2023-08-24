import {Event} from 'nostr-tools'

export function getLnurl(metadata : Event) : string | null {
    const utf8Decoder = new TextDecoder('utf-8')
    try {
        let lnurl: string = ''
        let {lud06, lud16} = JSON.parse(metadata.content)
        if (lud06) {
            return lud06
        } else if (lud16) {
            return lud16
        } else {
          return null
        }
    } catch (e) {
        return null
    }
}