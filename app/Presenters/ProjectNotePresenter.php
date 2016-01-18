<?php

namespace App\Presenters;

use Prettus\Repository\Presenter\FractalPresenter;
use App\Transformers\ProjectNoteTransformer;

class ProjectNotePresenter extends FractalPresenter {

    public function getTransformer() {
        return new ProjectNoteTransformer();
    }

}
