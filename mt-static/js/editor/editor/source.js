/*
 * Movable Type (r) Open Source (C) 2001-2012 Six Apart, Ltd.
 * This program is distributed under the terms of the
 * GNU General Public License, version 2.
 *
 * $Id$
 */
;(function($) {

MT.Editor.Source = function(id) {
    var editor = this;
    MT.Editor.apply(this, arguments);

    this.$textarea = $('#' + id);
    this.textarea = this.$textarea.get(0);
    this.range = null;

    this.$textarea
        .keydown(function() {
            // Save the position of cursor for the insertion of asset. (IE)
            editor.saveSelection();
            editor.setDirty();
        })
        .mouseup(function() {
            editor.saveSelection();
        });
};
$.extend(MT.Editor.Source, MT.Editor, {
    formats: function() {
        return ['source'];
    }
});
$.extend(MT.Editor.Source.prototype, MT.Editor.prototype, {
    getContent: function() {
        return this.textarea.value;
    },

    setContent: function(content) {
        return this.textarea.value = content;
    },

    clearUndo: function() {
        return '';
    },

    focus: function() {
        this.textarea.focus();
    },

    getHeight: function() {
        return this.$textarea.height();
    },

    setHeight: function(height) {
        this.$textarea.height(height);
    },

    hide: function() {
        this.$textarea.hide();
    },

    insertContent: function(content) {
        this.setSelection(content);
    },

    getSelection: function() {
        var w = window;
        return w.getSelection ? w.getSelection() : w.document.selection;
    },

    getSelectedText: function() {
        var selection = this.getSelection();
        if ( selection.createRange ) {
            // ie
            this.range = null;
            this.focus();
            var range = selection.createRange();
            return range.text;
        } else {
            var length = this.textarea.textLength;
            var start = this.textarea.selectionStart;
            var end = this.textarea.selectionEnd;
            if ( end == 1 || end == 2 && defined( length ) )
                end = length;
            return this.textarea.value.substring( start, end );
        }
    },

    setSelection: function( txt ) {
        var el = this.textarea;
        var selection = this.getSelection();
        if ( selection.createRange ) {
            var range = this.range;
            if ( !range ) {
                this.focus();
                range = selection.createRange();
            }
            range.text = txt;
            range.select();
        } else {
            var scrollTop = el.scrollTop;
            var length = el.textLength;
            var start = el.selectionStart;
            var end = el.selectionEnd;
            if ( end == 1 || end == 2 && defined( length ) )
                end = length;
            el.value = el.value.substring( 0, start ) + txt + el.value.substr( end, length );
            el.selectionStart = start;
            el.selectionEnd = start + txt.length;
            el.scrollTop = scrollTop;
        }
        this.focus();
    },
    saveSelection: function() {
        var selection = this.getSelection();
        if ( selection.createRange ) {
            this.range = selection.createRange().duplicate();
        }
    }
});
MT.EditorManager.register('source', MT.Editor.Source);

})(jQuery);
