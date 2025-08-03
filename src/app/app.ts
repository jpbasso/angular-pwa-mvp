import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';

import {
  TemplateService,
  ChecklistTemplate,
} from './services/template.service';
import { NetworkService } from './services/network.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    CheckboxModule,
    SliderModule,
    TagModule,
    SelectModule,
  ],
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
  templateOptions = computed(() =>
    this.templates().map((t) => ({ label: t.name, value: t.id }))
  );
  selectedTemplate = signal<ChecklistTemplate | null>(null);
  form: FormGroup = this.fb.group({});
  online = this.network.online;
  tristateOptions = [
    { label: 'Sí', value: 'yes' },
    { label: 'No', value: 'no' },
    { label: 'N/A', value: 'na' },
  ];

  toSelectOptions(options: string[] = []) {
    return options.map((o) => ({ label: o, value: o }));
  }

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
