import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

// 데커레이터 인수는 참조하고자 하는 다른 속성의 이름과 ValidationOptions를 받는다.
export function NotIn(property: string, validationOptions?: ValidationOptions) {
  // registerDecorator를 호출하는 함수를 리턴한다.
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    // registerDecorator 함수는 ValidationDecoratorOptions 객체를 인수로 받는다.
    registerDecorator({
      name: 'NotIn', // 데커레이터 이름
      target: object.constructor, // 객체 생성 시 적용
      propertyName,
      options: validationOptions, // 데커레이터 인수로 받은 옵션을 적용한다.
      constraints: [property], // 속성에 적용되도록 제약을 준다.
      validator: {
        // 유효성 검사 규칙이 기술된다.
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
