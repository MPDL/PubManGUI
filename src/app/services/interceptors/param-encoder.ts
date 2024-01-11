import { HttpParameterCodec } from '@angular/common/http';

// The important part is the usage of encodeURIComponent, which is a vanilla JavaScript function to encode a string.

export class ParamEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }
    encodeValue(value: string): string {
        return encodeURIComponent(value);
    }
    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }
    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }
}
