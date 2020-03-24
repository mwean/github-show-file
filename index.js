'use strict';

function addButton(header) {
  var el = header.querySelector('.file-actions .flex-items-stretch');

  if (el.querySelector('.show-file-button')) {
    return
  }

  var button = document.createElement('button');
  button.classList.add('show-file-button');
  button.innerHTML = "Show File";
  el.prepend(button);
  var url = header.querySelectorAll('details-menu a')[0].href;

  button.addEventListener("click", function() {
    openModal(url)
  });
}

function createModal() {
  let modal = document.createElement('div');
  modal.classList.add('file-modal');

  Object.assign(
    modal.style,
    {
      "position": "fixed",
      "top": 0,
      "right": 0,
      "bottom": 0,
      "left": 0,
      "z-index": 999,
      "background-color": "rgba(0, 0, 0, 0.5)",
      "display": "none",
      "align-items": "center",
      "justify-content": "center",
      "overflow-y": "hidden"
    }
  );

  let modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  Object.assign(
    modalContent.style,
    {
      "width": "90%",
      "height": "90%",
      "overflow": "scroll"
    }
  );

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });
}

function handleEscape(event) {
  if (event.keyCode === 27) {
    closeModal();
    document.removeEventListener('keydown', handleEscape);
  }
};

function getModalContent(url, callback) {
  chrome.runtime.sendMessage({ action: "get-page-content", url: url }, function(response) {
    if (response && response.content) {
      callback(response.content);
    } else {
      fetch(url).then(function(res) {
        res.text().then(function(text) {
          chrome.runtime.sendMessage({ action: "set-page-content", url: url, content: text });
          callback(text);
        });
      });
    }
  });
}

function fillModal(url, modalContent) {
  getModalContent(url, function(text) {
    var frag = document.createRange().createContextualFragment(text);
    var content = frag.querySelector('.Box.position-relative');
    content.style.marginTop = 0;
    modalContent.appendChild(content);
  });
}

function openModal(url) {
  var modal = document.querySelector('.file-modal')
  var modalContent = modal.querySelector('.modal-content');

  fillModal(url, modalContent);

  document.addEventListener("keydown", handleEscape);
  document.body.style.overflowY = 'hidden';
  modal.style.display = 'flex';
}

function closeModal() {
  var modal = document.querySelector('.file-modal')

  modal.style.display = 'none';
  document.body.style.overflowY = 'auto';

  var modalContent = modal.querySelector('.modal-content');
  var contentDiv = modalContent.children[0];

  if (contentDiv) {
    modalContent.removeChild(contentDiv);
  }
}

if (document.location.pathname.match(/pull.\d+.files/)) {
  Array.from(document.querySelectorAll('.file-header')).forEach(function (el) {
    addButton(el);
  });

  createModal();
}
