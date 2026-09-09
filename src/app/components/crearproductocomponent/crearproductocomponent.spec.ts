import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Crearproductocomponent } from './crearproductocomponent';

describe('Crearproductocomponent', () => {
  let component: Crearproductocomponent;
  let fixture: ComponentFixture<Crearproductocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [provideRouter([]), provideHttpClient()],
      declarations: [Crearproductocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Crearproductocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empieza con el formulario vacío y sin estar guardando', () => {
    expect(component.producto.nombre).toBe('');
    expect(component.isSaving).toBe(false);
    expect(component.errorMsg).toBeNull();
  });

  it('deshabilita Publicar con el formulario inválido', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const submit = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(submit.disabled).toBe(true);
  });
});
