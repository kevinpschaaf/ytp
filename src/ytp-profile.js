/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import './../bower_components/polymer/polymer-element.html';

class YtpProfile extends Polymer.Element {

  static get is() { return 'ytp-profile'; }

  static get template() { return `
    <style>
      :host {
        display: block;

        padding: 10px 20px;
      }
    </style>
    User: [[user.title]]`;
  }
}

customElements.define(YtpProfile.is, YtpProfile);