import { toggleVisibility } from "../../utils/utils.js";

export function updateImages(images) {
    toggleVisibility(".images-frame", images.length > 0);
}
