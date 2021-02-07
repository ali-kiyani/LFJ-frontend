import { LFJTemplatePage } from './app.po';

describe('LFJ App', function() {
  let page: LFJTemplatePage;

  beforeEach(() => {
    page = new LFJTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
