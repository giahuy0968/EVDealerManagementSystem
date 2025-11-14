"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const TemplateRepository_1 = require("../repositories/TemplateRepository");
class TemplateService {
    constructor() {
        this.repo = new TemplateRepository_1.TemplateRepository();
    }
    list() { return this.repo.list(); }
    create(data) { return this.repo.create(data); }
    update(id, patch) { return this.repo.update(id, patch); }
    delete(id) { return this.repo.delete(id); }
    get(id) { return this.repo.findById(id); }
    render(content, variables) {
        return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
            const val = variables[key];
            return val !== undefined && val !== null ? String(val) : '';
        });
    }
}
exports.TemplateService = TemplateService;
