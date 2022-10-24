import { Constructable } from './index.ts';

export type ClassDecorator = <T, TConstructor extends Constructable<T>>(ctor: TConstructor) => TConstructor | void;

export type ClassDecoratorFactory<TDecoratorParameter, TDecorator extends ClassDecorator = ClassDecorator> = (
  parameters?: TDecoratorParameter,
) => TDecorator;
