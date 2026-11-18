import test from 'node:test';
import assert from 'node:assert/strict';
import { fechaMaximaNacimiento, validarFechaNacimiento } from '../src/utils/validaciones.js';

const hoy = new Date(2026, 10, 17, 15, 0); // Fecha fija: tests independientes del día de ejecución.

test('admite a quien cumple exactamente 18 años hoy', () => {
  assert.equal(fechaMaximaNacimiento(hoy), '2008-11-17');
  assert.equal(validarFechaNacimiento('2008-11-17', hoy), true);
});

test('rechaza a menores, nacidos hoy y fechas futuras', () => {
  for (const fecha of ['2008-11-18', '2026-11-17', '2027-01-01']) {
    assert.equal(validarFechaNacimiento(fecha, hoy), false);
  }
});

test('rechaza fechas vacías, mal formadas e inexistentes', () => {
  for (const fecha of ['', '2001-02-29', '0000-01-01', '2008-13-01', '2008-11-31']) {
    assert.equal(validarFechaNacimiento(fecha, hoy), false);
  }
});

test('calcula correctamente el límite en años bisiestos', () => {
  assert.equal(fechaMaximaNacimiento(new Date(2028, 1, 29)), '2010-02-28');
  assert.equal(validarFechaNacimiento('2000-02-29', hoy), true);
});
