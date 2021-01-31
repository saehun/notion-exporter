import { transform } from './transform';
import { download } from './notion';
import { commit } from './commit';

// main
download().then(transform).then(commit);
