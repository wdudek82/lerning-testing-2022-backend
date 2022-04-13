import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
interface ClassConstructor {
    new (...args: any[]): Record<string, any>;
}
export declare function Serialize(dto: ClassConstructor): MethodDecorator & ClassDecorator;
export declare class SerializeInterceptor implements NestInterceptor {
    private dto;
    constructor(dto: any);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
export {};
