import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import {
  TemplateService,
  ChecklistTemplate,
} from './services/template.service';
import { NetworkService } from './services/network.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private templateService = inject(TemplateService);
  private network = inject(NetworkService);
  private fb = inject(FormBuilder);

  templates = signal<ChecklistTemplate[]>(
    this.templateService.getStoredTemplates()
  );
  selectedTemplate = signal<ChecklistTemplate | null>(null);
  form: FormGroup = this.fb.group({});
  online = this.network.online;

  syncTemplates(): void {
    this.templateService.fetchTemplates().subscribe((t) => this.templates.set(t));
  }

  selectTemplate(id: string): void {
    const tpl = this.templates().find((t) => t.id === id) || null;
    this.selectedTemplate.set(tpl);
    if (tpl) {
      const group: Record<string, unknown> = {};
      for (const field of tpl.fields) {
        group[field.name] = [''];
      }
      this.form = this.fb.group(group);
    }
  }

  submit(): void {
    const result = {
      templateId: this.selectedTemplate()?.id,
      values: this.form.value,
    };

    if (this.online()) {
      console.log('Reporte enviado', result);
      this.templateService.sendStoredResults().subscribe();
    } else {
      this.templateService.storeResult(result);
    }
    this.form.reset();
  }
}
