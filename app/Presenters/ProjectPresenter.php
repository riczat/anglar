<?php

namespace app\Presenters;

use Prettus\Repository\Presenter\FractalPresenter;
use app\Transformers\ProjectTransformer;

class ProjectPresenter extends FractalPresenter
{

    public function getTransformer()
    {
        return new ProjectTransformer();
    }

}
