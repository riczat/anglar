<?php

namespace app\Presenters;

use Prettus\Repository\Presenter\FractalPresenter;
use app\Transformers\ProjectNoteTransformer;

class ProjectNotePresenter extends FractalPresenter {

    public function getTransformer() {
        return new ProjectNoteTransformer();
    }

}
