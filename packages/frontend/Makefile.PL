use strict;
use warnings;

use ExtUtils::MakeMaker;

WriteMakefile(
  VERSION   => '0.01',
  PREREQ_PM => {
    'Mojolicious'                   => '9.37',
    'Mojolicious::Plugin::Status'   => '1.17'
  },
  test => {TESTS => 't/*.t'}
);
