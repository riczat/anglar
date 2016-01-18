<?php

namespace App\Presenters;

use Prettus\Repository\Presenter\FractalPresenter;
use App\Transformers\ProjectTransformer;

class ProjectPresenter extends FractalPresenter
{

    public function getTransformer()
    {
        return new ProjectTransformer();
    }

}
