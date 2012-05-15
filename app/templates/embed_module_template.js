IWitness.Templates.embed_module_template = Handlebars.compile(
'<div class="iwitness_embed">' +
'  <style type="text/css">' +
'    .iwitness_embed {' +
'      overflow: hidden;' +
'      position: relative;' +
'      width: 501px;' +
'      border: 1px solid #d3d3d3;' +
'      font-family: helvetica, arial, sans-serif;' +
'      font-size: 13px;' +
'      background: url({{imagePath}}embed_iwitness_embed_background.gif) repeat-y;' +
'      -webkit-border-radius: 10px;' +
'      -moz-border-radius: 10px;' +
'      border-radius: 10px;' +
'    }' +

'    .iwitness_embed a { text-decoration: none; }' +

'    .iwitness_left_footer {' +
'      position: absolute;' +
'      bottom: 0;' +
'      left: 0;' +
'      width: 246px;' +
'      height: 25px;' +
'    }' +

'    .iwitness_left_footer a {' +
'      position: absolute;' +
'      top: 0;' +
'      right: 0;' +
'      bottom: 0;' +
'      display: block;' +
'      width: 88px;' +
'      text-indent: -999em;' +
'      background: url({{imagePath}}embed_via_iwitness.png) no-repeat 100% 50%;' +
'    }' +

'    .iwitness_item {' +
'      overflow: hidden;' +
'      float: left;' +
'      width: 100%;' +
'      border-bottom: 1px solid #d3d3d3;' +
'    }' +

'    .iwitness_item.iwitness_last_item {' +
'      margin-bottom: 25px;' +
'      border-bottom: 0;' +
'    }' +

'    .iwitness_item_wrapper {' +
'      float: left;' +
'      overflow: hidden;' +
'    }' +

'    .iwitness_item_left {' +
'      position: relative;' +
'      float: left;' +
'      width: 246px;' +
'      margin-bottom: -4000px;' +
'      padding-bottom: 4000px;' +
'      color: #fff;' +
'      -webkit-border-top-left-radius: 10px;' +
'      -webkit-border-bottom-left-radius: 10px;' +
'      -moz-border-radius-topleft: 10px;' +
'      -moz-border-radius-bottomleft: 10px;' +
'      border-top-left-radius: 10px;' +
'      border-bottom-left-radius: 10px;' +
'    }' +

'    .iwitness_item_meta {' +
'      height: 40px;' +
'      padding: 10px 0 6px 60px;' +
'      font-size: 16px;' +
'      font-weight: bold;' +
'    }' +

'    .iwitness_twitter .iwitness_item_meta { background: url({{imagePath}}embed_twitter.png) no-repeat 10px 50%; }' +
'    .iwitness_flickr  .iwitness_item_meta { background: url({{imagePath}}embed_flickr.png)  no-repeat 10px 50%; }' +

'    .iwitness_map { display: block; }' +

'    .iwitness_item_right {' +
'      float: right;' +
'      width: 253px;' +
'      margin-bottom: -4000px;' +
'      padding-bottom: 4000px;' +
'      -webkit-border-top-right-radius: 10px;' +
'      -webkit-border-bottom-right-radius: 10px;' +
'      -moz-border-radius-topright: 10px;' +
'      -moz-border-radius-bottomright: 10px;' +
'      border-top-right-radius: 10px;' +
'      border-bottom-right-radius: 10px;' +
'    }' +

'    .iwitness_user_info {' +
'      overflow: hidden;' +
'      position: relative;' +
'      display: block;' +
'      margin-bottom: 15px;' +
'      padding: 6px 28px 0 28px;' +
'      font-weight: bold;' +
'    }' +

'    .iwitness_user_info img {' +
'      float: left;' +
'      width: 40px;' +
'      margin-right: 8px;' +
'      border: 3px solid #4482a8;' +
'      -webkit-border-radius: 6px;' +
'      -moz-border-radius: 6px;' +
'      border-radius: 6px;' +
'    }' +

'    .iwitness_user_info .iwitness_user_name,' +
'    .iwitness_user_info .iwitness_user_handle {' +
'      overflow: hidden;' +
'      white-space: nowrap;' +
'      text-overflow: ellipsis;' +
'    }' +

'    .iwitness_user_name   { color: #4482a8; margin-top: 6px; }' +
'    .iwitness_user_handle { color: #353535; }' +

'    .iwitness_item_content {' +
'      padding: 0 28px;' +
'      color: #353535;' +
'      font-size: 13px;' +
'      line-height: 138%;' +
'    }' +

'    .iwitness_item_content a {' +
'      color: #4482a8;' +
'      font-weight: bold;' +
'    }' +

'    .iwitness_item_content img {' +
'      display: block;' +
'      width: 100%;' +
'      margin-bottom: 10px;' +
'      -webkit-border-radius: 10px;' +
'      -moz-border-radius: 10px;' +
'      border-radius: 10px;' +
'    }' +
'  </style>' +

'  <div class="iwitness_left_footer">' +
'    <a href="http://iwitness.adaptivepath.com" target="_blank">via iWitness</a>' +
'  </div>' +

'{{#each flaggedResults}}' +
'  <div class="iwitness_item iwitness_{{type}} {{additionalClasses}}">' +
'    <div class="iwitness_item_left">' +
'      <div class="iwitness_item_meta">' +
'        <div class="iwitness_item_date_posted">{{postedDate}}</div>' +
'        <div class="iwitness_item_time_posted">{{postedTime}}</div>' +
'      </div>' +
'      <img src="{{staticMapUrl}}" alt="Map" class="iwitness_map">' +
'    </div>' +
'    <div class="iwitness_item_right">' +
'      <a href="#" class="iwitness_user_info" target="_blank">' +
'        <img src="{{avatarSrc}}" alt="User Photo">' +
'        <div class="iwitness_user_name">{{userNameSecondary}}</div>' +
'        <div class="iwitness_user_handle">{{userNamePrimary}}</div>' +
'      </a>' +

'      <div class="iwitness_item_content">' +
'        {{#each displayableMedia}}' +
'          {{#if isIFrame}}' +
'            <iframe class="content-link" type="text/html" src="{{mediaUrl}}" frameborder="0"></iframe>' +
'          {{else}}' +
'            <a class="content-link" target="_blank" href="{{linkUrl}}">' +
'              <img src="{{mediaUrl}}">' +
'            </a>' +
'          {{/if}}' +
'        {{/each}}' +
'        {{contentText}}' +
'      </div>' +
'    </div>' +
'  </div>' +
'{{/each}}' +
'</div>');
