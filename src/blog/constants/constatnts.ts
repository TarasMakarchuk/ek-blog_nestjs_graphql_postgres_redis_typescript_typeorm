import { join } from "path";

export const PAGE = 1;
export const LIMIT = 10;
export const MAX_LIMIT_ON_PAGE = 100;
export const IMAGE_SIZES = [
    {size: 100, folder: 'small'},
    {size: 200, folder: 'medium'},
    {size: 300, folder: 'large'},
];
export const MAX_IMAGE_FILE_SIZE_UPLOAD = 2000000;

export const MIN_IMAGE_HEIGHT = 400;
export const MIN_IMAGE_WIDTH = 400;
export const MAX_IMAGE_HEIGHT = 1600;
export const MAX_IMAGE_WIDTH = 1600;

export const IMAGE_PATH = join('public', 'uploads', 'images');

export const MILLISECONDS = 60000;
