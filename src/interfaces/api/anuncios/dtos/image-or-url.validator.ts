import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'ImageOrUrlValidator', async: false })
export class ImageOrUrlValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.imagen || obj.imagenUrl);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Debe proporcionar una URL de imagen o subir un archivo de imagen';
  }
}