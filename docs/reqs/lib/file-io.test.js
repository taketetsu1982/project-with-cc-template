import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { createFileIO } = require('./file-io.js');

describe('createFileIO', () => {
  it('必要なメソッドを全て返す', () => {
    const io = createFileIO({
      ids: { toast: 't', dot: 'd', label: 'l', hint: 'h', edited: 'e', autoBtn: 'a', overlay: 'o' },
      getFullJson: () => null,
      loadDataKey: '__test',
      keys: { undo: '__u', redo: '__r', copy: '__c', paste: '__p', cut: '__x', del: '__d' },
      filePickerId: 'test',
    });
    expect(typeof io.showToast).toBe('function');
    expect(typeof io.markModified).toBe('function');
    expect(typeof io.writeFile).toBe('function');
    expect(typeof io.handleConnect).toBe('function');
    expect(typeof io.toggleAuto).toBe('function');
    expect(typeof io.setupDragDrop).toBe('function');
    expect(typeof io.setupKeyboard).toBe('function');
    expect(typeof io.getFileHandle).toBe('function');
    expect(typeof io.updateStatus).toBe('function');
  });

  it('初期状態ではfileHandleがnull', () => {
    const io = createFileIO({
      ids: { toast: 't', dot: 'd', label: 'l', hint: 'h', edited: 'e', autoBtn: 'a', overlay: 'o' },
      getFullJson: () => null,
      loadDataKey: '__test',
      keys: { undo: '__u', redo: '__r', copy: '__c', paste: '__p', cut: '__x', del: '__d' },
      filePickerId: 'test',
    });
    expect(io.getFileHandle()).toBe(null);
  });
});
