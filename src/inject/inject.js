HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

chrome.extension.sendMessage({}, async (response) => {
	const readyStateCheckInterval = setInterval( async () => {
  	if (document.readyState === "complete") {
  		clearInterval(readyStateCheckInterval);

      const parser = new DOMParser();
      const commentTree = document.getElementsByClassName('comment-tree')[0].children[0];

      async function getMore(moreLink) {
        console.log('fetching');
        let res = await fetch(`${moreLink}`, {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-language": "en-US,en;q=0.9,nl-NL;q=0.8,nl;q=0.7",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1"
          },
          "referrer": "https://news.ycombinator.com/",
          "referrerPolicy": "origin",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "include"
        });
        let newHTML = await res.text();
        const newDoc = parser.parseFromString(newHTML, "text/html");
        let commentTreeNew = newDoc.getElementsByClassName('comment-tree')[0].children[0];
        commentTree.appendChild(document.createTextNode(`More from: ${moreLink}`));
        for (let comment of commentTreeNew.children) {
          commentTree.appendChild(comment);
        }

        // some weird bug means that the final 2 didn't get caputred
        let comment = commentTreeNew.children[commentTreeNew.children.length - 2];
        commentTree.appendChild(comment);
        comment = commentTreeNew.children[commentTreeNew.children.length - 1];
        commentTree.appendChild(comment);

        const newMoreLink = comment.getElementsByClassName('morelink')[0];
        if (newMoreLink) {
          getMore(newMoreLink);
        }
      }

      const moreLink = document.getElementsByClassName('morelink')[0];
      getMore(moreLink);
	 }
	}, 10);
});