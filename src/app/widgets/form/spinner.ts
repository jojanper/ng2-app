import { AppObserver } from '../../widgets/base';


class FormTracker extends AppObserver<ProgressTracker> {

    setState(state: string): void {
        this.setSubject({id: id, type: this.type, text: text});
    }
}
