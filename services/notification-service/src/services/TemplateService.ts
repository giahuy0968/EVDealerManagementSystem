import { TemplateRepository } from '../repositories/TemplateRepository';

export class TemplateService {
  private repo = new TemplateRepository();

  list() { return this.repo.list(); }
  create(data: any) { return this.repo.create(data); }
  update(id: string, patch: any) { return this.repo.update(id, patch); }
  delete(id: string) { return this.repo.delete(id); }
  get(id: string) { return this.repo.findById(id); }

  render(content: string, variables: Record<string, any>): string {
    return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
      const val = variables[key];
      return val !== undefined && val !== null ? String(val) : '';
    });
  }
}
