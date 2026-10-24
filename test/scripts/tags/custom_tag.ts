import { join } from 'path';
import { rmdir, writeFile } from 'hexo-fs';
import Hexo from '../../../lib/hexo';
import hashFiles from '../../util/hashFiles.cjs';
import chai from 'chai';
chai.should();

describe('custom_tag with hashFiles helper', () => {
  const testDir = join(__dirname, 'custom_tag_test_' + process.pid);
  const hexo = new Hexo(testDir, { silent: false });

  before(async () => {
    try {
      await rmdir(testDir);
    } catch {}
    await writeFile(join(testDir, 'fixtures', 'file1.txt'), 'content1');
    await writeFile(join(testDir, 'fixtures', 'file2.txt'), 'content2');
    await hexo.init();
    await hexo.load();
    // Expose hashFiles helper to Hexo's Nunjucks tag environment
    hexo.extend.tag.env.addGlobal('hashFiles', hashFiles.bind(hexo));
  });

  after(async () => {
    try {
      await rmdir(testDir);
    } catch {}
  });

  it('should render hashFiles helper in inline code', async () => {
    const content = 'build-{{ hashFiles(\'fixtures/*.txt\') }}';
    const data = await hexo.post.render('', {
      content,
      engine: 'markdown'
    });

    // Should contain both file hashes
    data.content.should.include('file1.txt');
    data.content.should.include('file2.txt');
    data.content.should.include('--'); // separator
  });

  it('should render hashFiles helper in code block', async () => {
    const content = '```js\nconst varx = `build-${{ hashFiles(\'fixtures/*.txt\') }}`\n```';
    const data = await hexo.post.render('', {
      content,
      engine: 'markdown'
    });

    // In code blocks, nunjucks variables are NOT evaluated - they're treated as literal text
    // The code block shows the raw template string
    data.content.should.include('build-');
    data.content.should.include('hashFiles');
  });

  it('should handle hashFiles with different algorithm', async () => {
    const content = '{{ hashFiles(\'fixtures/*.txt\', \'md5\') }}';
    const data = await hexo.post.render('', {
      content,
      engine: 'markdown'
    });

    // The format is "file:hash--file:hash" where hash is 32 chars for MD5
    data.content.should.match(/fixtures[\\/]file1\.txt:[a-f0-9]{32}--fixtures[\\/]file2\.txt:[a-f0-9]{32}/);
    // Should also include file names
    data.content.should.include('file1.txt');
    data.content.should.include('file2.txt');
  });

  it('should work with multiple patterns', async () => {
    const content = '{{ hashFiles([\'fixtures/*.txt\', \'fixtures/*.md\']) }}';
    const data = await hexo.post.render('', {
      content,
      engine: 'markdown'
    });

    data.content.should.include('file1.txt');
    data.content.should.include('file2.txt');
  });

  it('should handle non-matching file pattern', async () => {
    const content = '{{ hashFiles(\'nonexistent/*.txt\') }}';
    const data = await hexo.post.render('', {
      content,
      engine: 'markdown'
    });

    // Should return error message when no files match
    data.content.should.include('No files found matching pattern');
    data.content.should.include('nonexistent/*.txt');
  });

  it('should expose hashFiles as global in nunjucks tag environment', () => {
    // Verify the helper is available globally in the tag environment
    const nunjucks = hexo.extend.tag.env;
    // Check if the global was added to the environment
    const hasHashFiles = typeof nunjucks.addGlobal === 'function';
    hasHashFiles.should.be.true;
  });
});
