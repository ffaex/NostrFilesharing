# Nostr FileShare Client

## Description
Nostr FileShare Client is a simple, lean web client dedicated to facilitating the sharing and requesting of files over the Nostr network. It uses special event kinds, particularly `kind:1` with a `"t"` tag to mark posts as file sharing offers or requests. The client supports file sharing via HTTP and BitTorrent protocols, ensuring versatility and efficiency in file transfers.

## Features

### File Offering
Users can offer files with details including the title, description, and the file’s location provided in a standardized plain-text format. Example:

```plaintext
title: Autobiography, Charles Dickens
description: A very cool book I wrote
location: magnet:...
```

### File Requesting
Users can request files and offer a prize in satoshis to whoever provides the requested file. This process is based on trust. Example request:

```plaintext
title: Wanted: The Great Gatsby
description: Looking for a high-quality version of this classic novel
offer: 1000 satoshis
```

### Table View
Offers and requests are displayed in a structured table view for easy navigation and access. This UI layout streamlines the process of finding and offering files.

### Zap Spec Integration
The client integrates the "zap" spec for tipping, allowing file offerers to receive tips for providing files and enabling requesters to fulfill their promised payments.

### Comments & Reputation System
Comments on file offers and requests are displayed, enabling users to engage and potentially build a rudimentary reputation system. Alternatively, a `nostr:nevent1` link to posts might be used to facilitate user interaction within their preferred client.

## Contribution
Contributions are welcome! Feel free to open issues or submit pull requests to enhance the Nostr FileShare Client. Your input is invaluable.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments
A special thanks to the Nostr community and jb55 for their ongoing support and collaboration in making this project a reality.

**Note**: Please ensure to check the legality and copyright restrictions of the files you are sharing or requesting to comply with the applicable laws and regulations.
