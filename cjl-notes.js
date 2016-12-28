var Cathmhaol = window.Cathmhaol || {};

/**
 * Creates mouseover tooltips based on end-notes.
 *
 * Markup note example: <a class="sample-note cjl-note" href="#process-note-1" aria-describedby="#process-note-1"><span class="aria-only">Note</span>1</a>
 * Markup list example: <section id="sample-notes"><header>Notes</header><ol><li id="sample-note-1" aria-labelledby="#process-note-1">Sample note #1.</li><li id="sample-note-2" aria-labelledby="#process-note-2">Sample note #2.</li></ol></section>
 * Call example: var n = new Cathmhaol.Notes(document.getElementById("sample-notes"), "a", "sample-note");
 *
 * Markup note example: <sup class="sample-note cjl-note" href="#process-note-1">1</sup>
 * Markup list example: <ol id="sample-notes"><li id="sample-note-1">Sample note #1.</li><li id="sample-note-2">Sample note #2.</li></ol>
 * Call example: var n = new Cathmhaol.Notes(document.getElementById("sample-notes"), "sup", "sample-note", "title");
 *
 * @author Robert King (hrobertking@cathmhaol.com)
 *
 * @version 1.1.3
 *
 * @param {string|HTMLElement} list
 * @param {string|NodeList} notes
 * @param {string} qualifier
 * @param {string} attr
 */
Cathmhaol.Notes = function(list, notes, qualifier, attr) {
 var ahref
   , description
   , id
   , listIndex
   , notesIndex
   , rule = [ ]
   , selector = qualifier.replace(/\s/g, '.')
   , style = document.getElementById('cjl-notes-style')
   , tmp = [ ]
   , txt
 ;

 /**
 * CONSTRUCTOR
 */
 list = (typeof list === 'string') ? document.getElementById(list) : (list.nodeType === 1) ? list : null;
 list = (list.nodeName !== 'OL') ? list.getElementsByTagName('ol').item(0) : list; /* Only ordered lists are allowed */
 list = (list.nodeName === 'OL') ? list.getElementsByTagName('li') : null; /* Only ordered lists are allowed */

 notes = (typeof notes === 'string') ? document.getElementsByTagName(notes === '' ? 'a' : notes) : !notes ? document.getElementsByTagName('a') : notes;

 qualifier = (typeof qualifier === 'string') ? qualifier : qualifier.toString();
 qualifier = new RegExp('\\b'+qualifier.replace(/[^a-z0-9\-\_\s]/g, '').replace(/\-/g, '\\-')+'\\b');

 attr = (typeof attr === 'string') ? attr : null;
 attr = attr || 'data-tip';

 if (list) {
  id = list.id || qualifier.source.replace(/\\b/, '').replace(/\\/, '');
  listIndex = list.length - 1;
  notesIndex = notes.length - 1;

  if (!style && attr !== 'title') {
   rule.push('.cjl-note { display:inline; position:relative; }');
   rule.push('.cjl-note .aria-only { position:absolute; clip:rect(0px, 0px, 0px, 0px); }');
   rule.push('.cjl-note:focus { outline:none; }');
   rule.push('.cjl-note:focus:after, .cjl-note:hover:after { background:rgba(200, 200, 200, .9); border:3px solid rgb(128, 128, 128); border-radius:5px; bottom:26px; color:rgb(0, 0, 0); content:attr(' + attr + '); left:-200%; margin-left:-3px; max-width:500px; min-width:200px; padding:5px 15px; position:absolute; z-index:1000; }');
   rule.push('.cjl-note:focus:before, .cjl-note:hover:before { border-color:rgb(128, 128, 128) transparent; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid rgb(128, 128, 128); bottom:20px; content:""; left:-10%; position:absolute; z-index:1001; }');

   rule.push('.' + selector + '{ cursor:pointer; font-size:0.9em; position:relative; text-decoration:none; top:-0.5em; }');

   style = document.createElement('style');
   style.setAttribute('id', 'cjl-notes-style');
   style.setAttribute('type', 'text/css');
   try {
    style.innerHTML = rule.join('\n');
   } catch (IE_HTMLElement_Error) {
    style.text = rule.join('\n');
   } finally {
    document.getElementsByTagName('head').item(0).appendChild(style);
   }
  }
  if (qualifier) {
   while (notesIndex > -1) {
    if (qualifier.test(notes.item(notesIndex).className)) {
     tmp.push(notes.item(notesIndex));
     notes.item(notesIndex).id = notes.item(notesIndex).id || id + '-' + (notesIndex + 1);
    }
    notesIndex -= 1;
   }
   notes = tmp;
  }
  while (listIndex > -1) {
   /* Get the matching note from the document */
   notesIndex = notes.length - 1;
   while (notesIndex > -1) {
    if (notes[notesIndex].innerHTML.replace(/\D/gi, '') == listIndex + 1) {
     ahref = (/\bhref\s*\=\s*[\"\']([^\"\']*)[\"\']/).exec(list[listIndex].innerHTML);
     txt = list[listIndex].innerHTML.replace(/\<[^\>]*\>/gi, '') + (ahref && ahref.length > 1 ? ' [' + ahref[1] + ']' : '');
     txt = txt.replace(/\&nbsp\;/gi, ' ');
     /* Note text matches index */
     notes[notesIndex].href = notes[notesIndex].href || list[listIndex].id;
     notes[notesIndex].setAttribute(attr, txt);
     notes[notesIndex].className = notes[notesIndex].className.replace(/\bcjl\-note\b/g, '') + ' cjl-note';
    }
    notesIndex -= 1;
   }
   listIndex -= 1;
  }
 }
 return;
};
